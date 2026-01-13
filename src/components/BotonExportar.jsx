/*
 * Botón de Exportar - Descarga el diseño como imagen PNG de alta calidad
 */
import { eliminarFondo, tenirRemera } from '../utils/procesamientoImagen'
import './BotonExportar.css'

const BotonExportar = ({ colorRemera, talle, estampas, tipoPrenda }) => {

    const manejarExportacion = async () => {
        try {
            alert('⏳ Generando imagen de alta calidad...')

            const canvasFinal = document.createElement('canvas')
            canvasFinal.width = 1200
            canvasFinal.height = 750
            const ctxFinal = canvasFinal.getContext('2d')

            // Lógica de colores dinámica para la exportación
            const esNegro = colorRemera === '#000000'
            const colorFondo = esNegro ? '#FFFFFF' : '#0a0a0a'
            const colorTexto = esNegro ? '#0a0a0a' : '#FFFFFF'

            // Fondo de la composición
            ctxFinal.fillStyle = colorFondo
            ctxFinal.fillRect(0, 0, 1200, 750)

            const cargarImagen = (url) => new Promise((resolve, reject) => {
                const img = new Image(); img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img); img.onerror = reject; img.src = url;
            })

            const renderizarLado = async (lado, xOffset) => {
                const urlRemera = `/assets/tshirts/${tipoPrenda}-${lado}-white.png`
                const diseno = estampas[lado]

                const [imgRemera, imgIcono] = await Promise.all([
                    cargarImagen(urlRemera),
                    diseno.icono ? cargarImagen(diseno.icono.src) : Promise.resolve(null)
                ])

                const canvasTemp = document.createElement('canvas')
                canvasTemp.width = 600
                canvasTemp.height = 750
                const ctx = canvasTemp.getContext('2d')

                const sinFondo = eliminarFondo(imgRemera, colorRemera)
                const remeraFinal = (colorRemera !== '#FFFFFF') ? tenirRemera(sinFondo, colorRemera) : sinFondo

                const relacionAspecto = remeraFinal.width / remeraFinal.height

                // Ajuste de escala: aumentado para que los diseños entren 100%
                // Factor de escala dinámico para igualar frente y espalda
                const factorEscala = tipoPrenda === 'musculosa'
                    ? (lado === 'back' ? 1.35 : 1.25)
                    : 0.95
                let sW = 600 * factorEscala, sH = sW / relacionAspecto
                if (sH > 750 * factorEscala) { sH = 750 * factorEscala; sW = sH * relacionAspecto }
                const sX = (600 - sW) / 2
                const sY = (750 - sH) / 2

                // Dibujar Remera con Sombras (ajustadas según el fondo)
                ctx.save()
                ctx.shadowColor = esNegro ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.5)'
                ctx.shadowBlur = 15
                ctx.shadowOffsetY = 5
                ctx.drawImage(remeraFinal, sX, sY, sW, sH)
                ctx.restore()

                // Dibujar Diseño
                if (imgIcono) {
                    ctx.save()
                    if (!esNegro) {
                        ctx.shadowColor = 'rgba(0,0,0,0.3)'
                        ctx.shadowBlur = 10
                        ctx.shadowOffsetY = 3
                    }
                    ctx.drawImage(imgIcono, diseno.posicion.x - diseno.tamanio / 2, diseno.posicion.y - diseno.tamanio / 2, diseno.tamanio, diseno.tamanio)
                    ctx.restore()
                }

                // Texto del Lado
                ctx.fillStyle = colorTexto
                ctx.font = 'bold 20px sans-serif'
                ctx.textAlign = 'center'
                ctx.fillText(lado === 'front' ? 'VISTA FRONTAL' : 'VISTA ESPALDA', 300, 730)

                ctxFinal.drawImage(canvasTemp, xOffset, 0)
            }

            await renderizarLado('front', 0)
            await renderizarLado('back', 600)

            // Info de la marca y pedido
            ctxFinal.fillStyle = esNegro ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)'
            ctxFinal.font = '14px sans-serif'
            ctxFinal.textAlign = 'left'
            const textoPedido = `PEDIDO - ${tipoPrenda.toUpperCase()} - TALLE: ${talle}`
            ctxFinal.fillText(textoPedido, 30, 40)
            ctxFinal.textAlign = 'right'
            ctxFinal.fillText('Nazareno Customs Creator ©', 1170, 40)

            // Descarga
            const link = document.createElement('a')
            link.download = `pedido-${tipoPrenda}-${Date.now()}.png`
            link.href = canvasFinal.toDataURL('image/png', 1.0)
            link.click()

            alert('✅ ¡Imagen lista! Ambas vistas guardadas correctamente.')
        } catch (error) {
            console.error('Error al exportar:', error)
            alert('Error al generar la imagen. Verifica los permisos de descarga.')
        }
    }

    return (
        <button className="boton-exportar" onClick={manejarExportacion}>
            💾 Descargar Diseño Completo
        </button>
    )
}

export default BotonExportar

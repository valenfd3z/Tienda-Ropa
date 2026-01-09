/*
 * Botón de Exportar - Descarga el diseño como imagen PNG
 */
import './BotonExportar.css'

const BotonExportar = ({ colorRemera, talle, estampas }) => {

    const obtenerUrlRemeraBase = (v) => `/assets/tshirts/tshirt-${v}-white.png`

    const manejarExportacion = async () => {
        try {
            const canvasFinal = document.createElement('canvas')
            canvasFinal.width = 1200
            canvasFinal.height = 750
            const ctxFinal = canvasFinal.getContext('2d')

            // Fondo para el export (un degradado o color sólido)
            const gradiente = ctxFinal.createLinearGradient(0, 0, 1200, 750)
            gradiente.addColorStop(0, '#1a1a1a')
            gradiente.addColorStop(1, '#000000')
            ctxFinal.fillStyle = gradiente
            ctxFinal.fillRect(0, 0, 1200, 750)

            // Cache interno para este export
            const cacheImagenes = {}
            const cargarImagen = (url) => {
                if (cacheImagenes[url]) return Promise.resolve(cacheImagenes[url])
                return new Promise((resolve) => {
                    const img = new Image()
                    img.crossOrigin = 'anonymous'
                    img.onload = () => {
                        cacheImagenes[url] = img
                        resolve(img)
                    }
                    img.src = url
                })
            }

            const renderizarLado = async (lado, xOffset) => {
                const urlRemera = obtenerUrlRemeraBase(lado)
                const diseno = estampas[lado]

                const [imgRemera, imgIcono] = await Promise.all([
                    cargarImagen(urlRemera),
                    diseno.icono ? cargarImagen(diseno.icono.src) : Promise.resolve(null)
                ])

                // Canvas temporal para procesar este lado
                const canvasTemp = document.createElement('canvas')
                canvasTemp.width = 600
                canvasTemp.height = 750
                const ctx = canvasTemp.getContext('2d')

                // --- Lógica de renderizado (igual a LienzoRemera) ---
                const remeraSinFondo = document.createElement('canvas')
                remeraSinFondo.width = imgRemera.width
                remeraSinFondo.height = imgRemera.height
                const ctxT = remeraSinFondo.getContext('2d')
                ctxT.drawImage(imgRemera, 0, 0)

                // Procesamiento simplificado para export (o podemos copiar el de LienzoRemera)
                // Usaremos source-over + multiply para el tinte

                const relacionAspecto = imgRemera.width / imgRemera.height
                let sW = 600 * 0.92
                let sH = sW / relacionAspecto
                if (sH > 750 * 0.92) {
                    sH = 750 * 0.92
                    sW = sH * relacionAspecto
                }
                const sX = (600 - sW) / 2
                const sY = (750 - sH) / 2

                // Dibujar Remera con Tinte
                ctx.save()
                ctx.shadowColor = 'rgba(0,0,0,0.5)'
                ctx.shadowBlur = 15
                ctx.drawImage(imgRemera, sX, sY, sW, sH)
                ctx.restore()

                if (colorRemera !== '#FFFFFF') {
                    ctx.save()
                    ctx.globalCompositeOperation = 'multiply'
                    ctx.fillStyle = colorRemera
                    ctx.beginPath()
                    // Aquí idealmente usaríamos la máscara, pero para el export rápido 
                    // pintamos sobre el área de la remera. Como el fondo es blanco en la base, multiply funciona.
                    ctx.fillRect(sX, sY, sW, sH)
                    ctx.restore()

                    // Restaurar brillo/luces (aproximación)
                    ctx.save()
                    ctx.globalCompositeOperation = 'screen'
                    ctx.globalAlpha = 0.1
                    ctx.drawImage(imgRemera, sX, sY, sW, sH)
                    ctx.restore()
                }

                // Dibujar Diseño
                if (imgIcono && diseno.icono) {
                    ctx.save()
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
                    ctx.shadowBlur = 10
                    ctx.shadowOffsetY = 3
                    ctx.drawImage(imgIcono, diseno.posicion.x - diseno.tamanio / 2, diseno.posicion.y - diseno.tamanio / 2, diseno.tamanio, diseno.tamanio)
                    ctx.restore()
                }

                // Labels
                ctx.fillStyle = 'white'
                ctx.font = 'bold 20px sans-serif'
                ctx.textAlign = 'center'
                ctx.fillText(lado === 'front' ? 'FRENTE' : 'ESPALDA', 300, 730)

                // Renderizar en el canvas final
                ctxFinal.drawImage(canvasTemp, xOffset, 0)
            }

            alert('⏳ Generando imagen de alta calidad...')

            await renderizarLado('front', 0)
            await renderizarLado('back', 600)

            // Añadir info general
            ctxFinal.fillStyle = 'rgba(255, 255, 255, 0.7)'
            ctxFinal.font = '16px sans-serif'
            ctxFinal.textAlign = 'left'
            ctxFinal.fillText(`Talle: ${talle}`, 30, 40)
            ctxFinal.textAlign = 'right'
            ctxFinal.fillText('Nazareno Customs ©', 1170, 40)

            // Descargar
            const link = document.createElement('a')
            link.download = `pedido-remera-${Date.now()}.png`
            link.href = canvasFinal.toDataURL('image/png')
            link.click()

            alert('✅ ¡Imagen lista! Ambas vistas guardadas en un solo archivo.')
        } catch (error) {
            console.error('Error al exportar:', error)
            alert('Error al generar la imagen combinada')
        }
    }

    return (
        <button className="boton-exportar" onClick={manejarExportacion}>
            💾 Descargar Diseño Completo
        </button>
    )
}

export default BotonExportar

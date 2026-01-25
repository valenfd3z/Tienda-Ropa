/*
 * Botón de Exportar - Descarga el diseño como imagen PNG de alta calidad
 */
import { eliminarFondo, tenirRemera } from '../utils/procesamientoImagen'
import './BotonExportar.css'

const BotonExportar = ({ colorRemera, talle, estampas, tipoPrenda }) => {

    const manejarExportacion = async () => {
        try {
            alert('⏳ Generando imagen de alta calidad...')

            const lienzoFinal = document.createElement('canvas')
            lienzoFinal.width = 1200
            lienzoFinal.height = 750
            const contextoFinal = lienzoFinal.getContext('2d')

            // Configuración dinámica de colores según el tono de la prenda
            const esNegro = colorRemera === '#1A1A1A'
            const colorFondo = esNegro ? '#FFFFFF' : '#0a0a0a'
            const colorTexto = esNegro ? '#0a0a0a' : '#FFFFFF'

            // Pintar el fondo de la composición
            contextoFinal.fillStyle = colorFondo
            contextoFinal.fillRect(0, 0, 1200, 750)

            /**
             * Carga una imagen de forma asíncrona permitiendo el uso de cross-origin
             */
            const cargarImagen = (url) => new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
            })

            /**
             * Procesa y dibuja una de las caras (frente o espalda) en la posición indicada
             */
            const renderizarLado = async (lado, desplazamientoX) => {
                const urlRemera = `/assets/tshirts/${tipoPrenda}-${lado}-white.png`
                const diseno = estampas[lado]

                const [imagenRemera, imagenIcono] = await Promise.all([
                    cargarImagen(urlRemera),
                    diseno.icono ? cargarImagen(diseno.icono.src) : Promise.resolve(null)
                ])

                const lienzoTemporal = document.createElement('canvas')
                lienzoTemporal.width = 600
                lienzoTemporal.height = 750
                const contextoCara = lienzoTemporal.getContext('2d')

                // Procesamiento de la prenda: quitar fondo y aplicar tinte
                const sinFondo = eliminarFondo(imagenRemera, colorRemera)
                const remeraFinal = (colorRemera !== '#FFFFFF') ? tenirRemera(sinFondo, colorRemera) : sinFondo

                const relacionAspecto = remeraFinal.width / remeraFinal.height

                // Cálculo de escala para asegurar que el diseño quepa al 100%
                // Se compensa la diferencia de tamaño en los assets de musculosas traseras
                const factorEscala = tipoPrenda === 'musculosa'
                    ? (lado === 'back' ? 1.35 : 1.25)
                    : 0.95

                let anchoDeseado = 600 * factorEscala
                let altoDeseado = anchoDeseado / relacionAspecto

                if (altoDeseado > 750 * factorEscala) {
                    altoDeseado = 750 * factorEscala;
                    anchoDeseado = altoDeseado * relacionAspecto
                }

                const posX = (600 - anchoDeseado) / 2
                const posY = (750 - altoDeseado) / 2

                // Renderizado de la prenda con profundidad de sombras
                contextoCara.save()
                contextoCara.shadowColor = esNegro ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.5)'
                contextoCara.shadowBlur = 15
                contextoCara.shadowOffsetY = 5
                contextoCara.drawImage(remeraFinal, posX, posY, anchoDeseado, altoDeseado)
                contextoCara.restore()

                // Renderizado del diseño (estampado)
                if (imagenIcono) {
                    contextoCara.save()
                    if (!esNegro) {
                        contextoCara.shadowColor = 'rgba(0,0,0,0.3)'
                        contextoCara.shadowBlur = 10
                        contextoCara.shadowOffsetY = 3
                    }
                    contextoCara.drawImage(
                        imagenIcono,
                        diseno.posicion.x - diseno.tamanio / 2,
                        diseno.posicion.y - diseno.tamanio / 2,
                        diseno.tamanio,
                        diseno.tamanio
                    )
                    contextoCara.restore()
                }

                // Etiqueta informativa de la vista
                contextoCara.fillStyle = colorTexto
                contextoCara.font = 'bold 20px sans-serif'
                contextoCara.textAlign = 'center'
                contextoCara.fillText(lado === 'front' ? 'VISTA FRONTAL' : 'VISTA TRASERA', 300, 730)

                contextoFinal.drawImage(lienzoTemporal, desplazamientoX, 0)
            }

            // Ejecutar el renderizado de ambas caras de forma secuencial/coordinada
            await renderizarLado('front', 0)
            await renderizarLado('back', 600)

            // Información de Branding y Pedido en la cabecera del canvas
            contextoFinal.fillStyle = esNegro ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)'
            contextoFinal.font = '14px sans-serif'
            contextoFinal.textAlign = 'left'
            const metadatosPedido = `PEDIDO - ${tipoPrenda.toUpperCase()} - TALLE: ${talle}`
            contextoFinal.fillText(metadatosPedido, 30, 40)
            contextoFinal.textAlign = 'right'
            contextoFinal.fillText('Nazareno Customs Creator ©', 1170, 40)

            // Procedimiento de descarga del archivo final
            const enlaceDescarga = document.createElement('a')
            enlaceDescarga.download = `pedido-${tipoPrenda}-${Date.now()}.png`
            enlaceDescarga.href = lienzoFinal.toDataURL('image/png', 1.0)
            enlaceDescarga.click()

            alert('✅ ¡Imagen lista! Ambas vistas guardadas correctamente.')
        } catch (error) {
            console.error('Error crítico en el proceso de exportación:', error)
            alert('Error al generar la imagen. Verifica los permisos de descarga.')
        }
    }

    return (
        <button className="boton-exportar" onClick={manejarExportacion}>
            <span>💾 Descargar Diseño Completo</span>
        </button>
    )
}

export default BotonExportar

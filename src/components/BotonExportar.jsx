/*
 * Botón de Exportar - Descarga el diseño como imagen PNG
 */
import './BotonExportar.css'

const BotonExportar = ({ refCanvas }) => {
    const manejarExportacion = async () => {
        if (!refCanvas) {
            alert('El lienzo aún no está listo')
            return
        }

        try {
            // Renderizar sin el borde de selección antes de exportar
            if (refCanvas.renderWithoutSelection) {
                await refCanvas.renderWithoutSelection()
            }

            refCanvas.toBlob((blob) => {
                if (!blob) {
                    alert('Error al exportar la imagen')
                    return
                }

                const url = URL.createObjectURL(blob)
                const enlace = document.createElement('a')
                enlace.href = url
                enlace.download = `mi-remera-personalizada-${Date.now()}.png`
                document.body.appendChild(enlace)
                enlace.click()
                document.body.removeChild(enlace)
                URL.revokeObjectURL(url)

                alert('✅ ¡Imagen descargada! Ahora podés enviarla por WhatsApp para realizar tu pedido.')
            }, 'image/png')
        } catch (error) {
            console.error('Error al exportar:', error)
            alert('Ocurrió un error al intentar exportar la imagen')
        }
    }

    return (
        <button className="boton-exportar" onClick={manejarExportacion}>
            💾 Descargar Diseño (PNG)
        </button>
    )
}

export default BotonExportar

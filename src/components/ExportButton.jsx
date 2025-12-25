import './ExportButton.css'

const ExportButton = ({ canvasRef }) => {
    const handleExport = async () => {
        if (!canvasRef) {
            alert('El canvas aún no está listo')
            return
        }

        try {
            // If the canvas has the special render function, call it to hide selection box
            if (canvasRef.renderWithoutSelection) {
                await canvasRef.renderWithoutSelection()
            }

            // Convert canvas to blob
            canvasRef.toBlob((blob) => {
                if (!blob) {
                    alert('Error al exportar la imagen')
                    return
                }

                // Create download link
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `mi-remera-${Date.now()}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)

                // Redraw with selection box after export
                if (canvasRef.renderWithSelection) {
                    // Note: ShirtCanvas automatically re-renders with selection on next state change
                    // but we can trigger a re-render if needed.
                }

                alert('✅ Imagen descargada! Ahora podés enviarla por WhatsApp')
            }, 'image/png')
        } catch (error) {
            console.error('Error exporting:', error)
            alert('Error al exportar la imagen')
        }
    }

    return (
        <button className="export-button" onClick={handleExport}>
            💾 Descargar Diseño (PNG)
        </button>
    )
}

export default ExportButton

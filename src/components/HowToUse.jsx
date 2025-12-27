import './HowToUse.css'

const HowToUse = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>📖 CÓMO USAR EL SIMULADOR</h2>
                <div className="instruction-step">
                    <h3>1. Bases del Diseño</h3>
                    <p>Elige el <strong>color</strong> y el <strong>talle</strong> de tu remera. Puedes alternar entre la vista de <strong>Frente</strong> y <strong>Espalda</strong> en cualquier momento.</p>
                </div>
                <div className="instruction-step">
                    <h3>2. Elige tu Estampado</h3>
                    <p>Selecciona uno de nuestros diseños exclusivos o <strong>¡sube el tuyo!</strong> Haz clic en "Subir tu Diseño" para usar tus propias imágenes (se recomiendan archivos <strong>PNG con fondo transparente</strong>).</p>
                </div>
                <div className="instruction-step">
                    <h3>3. Ajusta y Personaliza</h3>
                    <p>Mantén presionado y <strong>arrastra el diseño</strong> sobre la remera para ubicarlo donde prefieras. Utiliza los controles para ajustar el <strong>tamaño</strong> de la estampa.</p>
                </div>
                <div className="instruction-step">
                    <h3>4. Exporta y Comparte</h3>
                    <p>Una vez que tu diseño esté listo, haz clic en <strong>"DESCARGAR DISEÑO"</strong>. La imagen se guardará en tu dispositivo y podrás enviárnosla por <strong>WhatsApp</strong> o <strong>Instagram</strong> para concretar tu pedido.</p>
                </div>
                <div className="important-note warning">
                    <p>⚠️ <strong>CONSEJO PRO:</strong> El simulador es una herramienta visual. Cuando nos contactes, nos pondremos de acuerdo con los detalles finales para que tu remera quede impecable.</p>
                </div>
                <button className="got-it-button" onClick={onClose}>¡ENTENDIDO!</button>
            </div>
        </div>
    )
}

export default HowToUse

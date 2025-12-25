import './HowToUse.css'

const HowToUse = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>📖 CÓMO USAR EL SIMULADOR</h2>

                <div className="instruction-step">
                    <h3>1. Elegí tu Base</h3>
                    <p>Seleccioná el <strong>Color</strong> y el <strong>Talle</strong> de la remera. Podés alternar entre el <strong>Frente</strong> y la <strong>Espalda</strong>.</p>
                    <div className="important-note">
                        <p>💡 El simulador usa una <strong>remera blanca base</strong> y genera los otros colores automáticamente, manteniendo el mismo modelo y dimensiones.</p>
                    </div>
                </div>

                <div className="instruction-step">
                    <h3>2. Personalizá tu Diseño</h3>
                    <p>Elegí uno de nuestros iconos o <strong>¡subí el tuyo propio!</strong></p>
                    <div className="important-note">
                        <p>💡 <strong>IMPORTANTE:</strong> No te limites a los iconos que ves acá. Si tenés una imagen propia, podés subirla haciendo clic en <strong>"SUBIR TU DISEÑO"</strong>. Recomendamos usar archivos <strong>PNG con fondo transparente</strong> para un mejor resultado.</p>
                    </div>
                </div>

                <div className="instruction-step">
                    <h3>3. Cambiar la Foto de la Remera (Opcional)</h3>
                    <p>Si ya tenés una remera real, podés subir una foto desde <strong>"Imagen de la Remera"</strong> para tener una <strong>vista previa</strong>. La foto se guarda por <strong>color</strong> y por <strong>vista</strong> (frente/espalda).</p>
                    <div className="important-note">
                        <p>💡 Esta foto es solo de referencia y no reemplaza el mockup del simulador. Podés quitarla con <strong>"Quitar foto"</strong>. La remera blanca base no se modifica.</p>
                    </div>
                </div>

                <div className="instruction-step">
                    <h3>4. Ajustá y Posicioná</h3>
                    <p>Arrastrá el diseño sobre la remera para ubicarlo donde quieras. Usá el control de <strong>Tamaño</strong> para ajustarlo a tu gusto.</p>
                </div>

                <div className="instruction-step">
                    <h3>5. Descargá y Consultá</h3>
                    <p>Hacé clic en <strong>"DESCARGAR DISEÑO"</strong> para guardar la imagen. Luego, envianos la foto por <strong>WhatsApp</strong> o <strong>Instagram</strong> para que hagamos tu remera realidad.</p>
                </div>

                <div className="important-note warning">
                    <p>⚠️ <strong>RECORDÁ:</strong> Para que se vea mejor, recomendamos subir imágenes en buena calidad y, si es posible, con fondo lo más uniforme posible.</p>
                </div>

                <button className="got-it-button" onClick={onClose}>¡ENTENDIDO!</button>
            </div>
        </div>
    )
}

export default HowToUse

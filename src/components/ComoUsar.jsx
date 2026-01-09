/*
 * Modal Cómo Usar - Instrucciones de uso del simulador
 */
import './ComoUsar.css'

const ComoUsar = ({ estaAbierto, alCerrar }) => {
    if (!estaAbierto) return null

    return (
        <div className="superposicion-modal" onClick={alCerrar}>
            <div className="contenido-modal" onClick={e => e.stopPropagation()}>
                <button className="boton-cerrar" onClick={alCerrar}>&times;</button>
                <h2>📖 CÓMO USAR EL SIMULADOR</h2>

                <div className="paso-instruccion">
                    <h3>1. Bases del Diseño</h3>
                    <p>Elegí el <strong>color</strong> y el <strong>talle</strong> de tu remera. Podés alternar entre la vista de <strong>Frente</strong> y <strong>Espalda</strong> en cualquier momento.</p>
                </div>

                <div className="paso-instruccion">
                    <h3>2. Elegí tu Estampado</h3>
                    <p>Seleccioná uno de nuestros diseños exclusivos o <strong>¡subí el tuyo!</strong> Hacé clic en "Subir tu Diseño" para usar tus propias imágenes (se recomiendan archivos <strong>PNG con fondo transparente</strong>).</p>
                </div>

                <div className="paso-instruccion">
                    <h3>3. Ajustá y Personalizá</h3>
                    <p>Mantené presionado y <strong>arrastrá el diseño</strong> sobre la remera para ubicarlo donde prefieras. Usá los controles para ajustar el <strong>tamaño</strong> de la estampa.</p>
                </div>

                <div className="paso-instruccion">
                    <h3>4. Exportá y Compartí</h3>
                    <p>Una vez que tu diseño esté listo, hacé clic en <strong>"DESCARGAR DISEÑO"</strong>. La imagen se va a guardar en tu dispositivo y vas a poder enviárnosla por <strong>WhatsApp</strong> o <strong>Instagram</strong> para concretar tu pedido.</p>
                </div>

                <div className="nota-importante advertencia">
                    <p>⚠️ <strong>CONSEJO PRO:</strong> El simulador es una herramienta visual. Cuando nos contactes, nos ponemos de acuerdo con los detalles finales para que tu remera quede impecable.</p>
                </div>

                <button className="boton-entendido" onClick={alCerrar}>¡ENTENDIDO!</button>
            </div>
        </div>
    )
}

export default ComoUsar

/*
 * Alternador de Vista - Botones para cambiar entre frente y espalda
 */
import './AlternadorVista.css'

const AlternadorVista = ({ vista, alCambiarVista }) => {
    return (
        <div className="alternador-vista">
            <button
                className={`boton-vista ${vista === 'front' ? 'seleccionado' : ''}`}
                onClick={() => alCambiarVista('front')}
            >
                👕 Frente
            </button>
            <button
                className={`boton-vista ${vista === 'back' ? 'seleccionado' : ''}`}
                onClick={() => alCambiarVista('back')}
            >
                🔄 Espalda
            </button>
        </div>
    )
}

export default AlternadorVista

/*
 * Selector de Talle - Botones circulares para elegir el talle
 */
import './SelectorTalle.css'

const SelectorTalle = ({ talleSeleccionado, alCambiarTalle }) => {
    const talles = ['S', 'M', 'L', 'XL']

    return (
        <div className="selector-talle">
            {talles.map((talle) => (
                <button
                    key={talle}
                    className={`boton-talle ${talleSeleccionado === talle ? 'seleccionado' : ''}`}
                    onClick={() => alCambiarTalle(talle)}
                >
                    <span>{talle}</span>
                </button>
            ))}
        </div>
    )
}

export default SelectorTalle

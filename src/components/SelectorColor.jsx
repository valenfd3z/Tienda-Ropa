/*
 * Selector de Color - Cuadrícula de colores disponibles para la remera
 */
import { COLORES_DISPONIBLES } from '../constants'
import './SelectorColor.css'

const SelectorColor = ({ colorSeleccionado, alCambiarColor }) => {
    const colores = COLORES_DISPONIBLES

    return (
        <div className="selector-color">
            {colores.map((color) => (
                <button
                    key={color.valor}
                    className={`opcion-color ${colorSeleccionado === color.valor ? 'seleccionado' : ''}`}
                    style={{ backgroundColor: color.valor }}
                    onClick={() => alCambiarColor(color.valor)}
                    title={color.nombre}
                    aria-label={color.nombre}
                >
                    {colorSeleccionado === color.valor && (
                        <span className="marca-cotejo" style={{
                            color: color.esOscuro ? '#ffffff' : 'var(--primary-color)'
                        }}>✓</span>
                    )}
                </button>
            ))}
        </div>
    )
}

export default SelectorColor

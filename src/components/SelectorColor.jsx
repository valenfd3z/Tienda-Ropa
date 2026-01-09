/*
 * Selector de Color - Cuadrícula de colores disponibles para la remera
 */
import './SelectorColor.css'

const SelectorColor = ({ colorSeleccionado, alCambiarColor }) => {
    // Colores disponibles con nombre, hex y flag para contraste del check
    const colores = [
        { nombre: 'Blanco', valor: '#FFFFFF', esOscuro: false },
        { nombre: 'Gris Oscuro', valor: '#6B7280', esOscuro: true },
        { nombre: 'Negro', valor: '#000000', esOscuro: true },
        { nombre: 'Azul Marino', valor: '#1E3A8A', esOscuro: true },
        { nombre: 'Rojo', valor: '#DC2626', esOscuro: true },
        { nombre: 'Verde', valor: '#16A34A', esOscuro: true },
        { nombre: 'Turquesa', valor: '#06B6D4', esOscuro: false },
        { nombre: 'Morado', valor: '#7C3AED', esOscuro: true },
        { nombre: 'Rosa', valor: '#EC4899', esOscuro: true },
        { nombre: 'Naranja', valor: '#F97316', esOscuro: true },
        { nombre: 'Amarillo', valor: '#FACC15', esOscuro: false },
    ]

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
                            color: color.esOscuro ? '#ffffff' : '#667eea'
                        }}>✓</span>
                    )}
                </button>
            ))}
        </div>
    )
}

export default SelectorColor

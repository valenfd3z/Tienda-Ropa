/*
 * Selector de Tipo de Prenda - Para elegir entre Remera y Musculosa
 */
import './SelectorTipoPrenda.css'

const SelectorTipoPrenda = ({ tipoSeleccionado, alCambiarTipo }) => {
    const tipos = [
        { id: 'tshirt', nombre: 'Remera', icono: '👕' },
        { id: 'musculosa', nombre: 'Musculosa', icono: '🎽' }
    ]

    return (
        <div className="selector-tipo-prenda">
            {tipos.map((tipo) => (
                <button
                    key={tipo.id}
                    className={`opcion-tipo ${tipoSeleccionado === tipo.id ? 'seleccionado' : ''}`}
                    onClick={() => alCambiarTipo(tipo.id)}
                >
                    <span className="icono-tipo">{tipo.icono}</span>
                    <span className="nombre-tipo">{tipo.nombre}</span>
                </button>
            ))}
        </div>
    )
}

export default SelectorTipoPrenda

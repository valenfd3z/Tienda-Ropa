/*
 * Controles del Icono - Slider de tamaño y botones de ajuste
 */
import './ControlesIcono.css'

const ControlesIcono = ({
    tamanioIcono,
    alCambiarTamanioIcono,
    mostrarSeleccion,
    alAlternarSeleccion,
    alReiniciarPosicion,
    alLimpiarIcono
}) => {
    return (
        <div className="controles-icono">
            <div className="control-tamanio">
                <label htmlFor="tamanio-icono">Tamaño del Diseño</label>
                <div className="contenedor-deslizador">
                    <span className="etiqueta-tamanio">Pequeño</span>
                    <input
                        id="tamanio-icono"
                        type="range"
                        min="50"
                        max="250"
                        value={tamanioIcono}
                        onChange={(e) => alCambiarTamanioIcono(Number(e.target.value))}
                        className="deslizador-tamanio"
                    />
                    <span className="etiqueta-tamanio">Grande</span>
                </div>
                <div className="valor-tamanio">{tamanioIcono}px</div>
            </div>

            <div className="grupo-botones">
                <button
                    className={`boton-alternar ${!mostrarSeleccion ? 'activo' : ''}`}
                    onClick={alAlternarSeleccion}
                    title="Oculta o muestra el recuadro punteado"
                >
                    {mostrarSeleccion ? '👁️ Ocultar Borde' : '👁️ Mostrar Borde'}
                </button>
                <button
                    className="boton-reiniciar"
                    onClick={alReiniciarPosicion}
                    title="Centra el diseño en la remera"
                >
                    🎯 Centrar Diseño
                </button>
                <button
                    className="boton-limpiar"
                    onClick={alLimpiarIcono}
                    title="Elimina el diseño actual"
                >
                    🗑️ Quitar Diseño
                </button>
            </div>
        </div>
    )
}

export default ControlesIcono

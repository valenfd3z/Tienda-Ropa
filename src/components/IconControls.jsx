import './IconControls.css'

const IconControls = ({ iconSize, onIconSizeChange, showSelection, onToggleSelection, onResetPosition }) => {
    return (
        <div className="icon-controls">
            <div className="size-control">
                <label htmlFor="icon-size">Tamaño del Diseño</label>
                <div className="slider-container">
                    <span className="size-label">Pequeño</span>
                    <input
                        id="icon-size"
                        type="range"
                        min="50"
                        max="200"
                        value={iconSize}
                        onChange={(e) => onIconSizeChange(Number(e.target.value))}
                        className="size-slider"
                    />
                    <span className="size-label">Grande</span>
                </div>
                <div className="size-value">{iconSize}px</div>
            </div>

            <div className="button-group">
                <button className={`toggle-button ${!showSelection ? 'active' : ''}`} onClick={onToggleSelection}>
                    {showSelection ? '👁️ Ocultar Borde' : '👁️ Mostrar Borde'}
                </button>
                <button className="reset-button" onClick={onResetPosition}>
                    🎯 Centrar Diseño
                </button>
            </div>
        </div>
    )
}

export default IconControls

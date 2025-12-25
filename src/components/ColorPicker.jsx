import './ColorPicker.css'

const ColorPicker = ({ selectedColor, onColorChange }) => {
    const colors = [
        { name: 'Blanco', value: '#FFFFFF', dark: false },
        { name: 'Gris Oscuro', value: '#6B7280', dark: true },
        { name: 'Negro', value: '#000000', dark: true },
        { name: 'Azul Marino', value: '#1E3A8A', dark: true },
        { name: 'Rojo', value: '#DC2626', dark: true },
        { name: 'Verde', value: '#16A34A', dark: true },
        { name: 'Turquesa', value: '#06B6D4', dark: false },
        { name: 'Morado', value: '#7C3AED', dark: true },
        { name: 'Rosa', value: '#EC4899', dark: true },
        { name: 'Naranja', value: '#F97316', dark: true },
        { name: 'Amarillo', value: '#FACC15', dark: false },
    ]

    return (
        <div className="color-picker">
            {colors.map((color) => (
                <button
                    key={color.value}
                    className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => onColorChange(color.value)}
                    title={color.name}
                    aria-label={color.name}
                >
                    {selectedColor === color.value && (
                        <span className="checkmark" style={{
                            color: color.dark ? '#ffffff' : '#667eea'
                        }}>✓</span>
                    )}
                </button>
            ))}
        </div>
    )
}

export default ColorPicker

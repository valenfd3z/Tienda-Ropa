import './SizeSelector.css'

const SizeSelector = ({ selectedSize, onSizeChange }) => {
    const sizes = ['S', 'M', 'L', 'XL']

    return (
        <div className="size-selector">
            {sizes.map((size) => (
                <button
                    key={size}
                    className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => onSizeChange(size)}
                >
                    {size}
                </button>
            ))}
        </div>
    )
}

export default SizeSelector

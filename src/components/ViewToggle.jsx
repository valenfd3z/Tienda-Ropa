import './ViewToggle.css'

const ViewToggle = ({ view, onViewChange }) => {
    return (
        <div className="view-toggle">
            <button
                className={`view-button ${view === 'front' ? 'selected' : ''}`}
                onClick={() => onViewChange('front')}
            >
                👕 Frente
            </button>
            <button
                className={`view-button ${view === 'back' ? 'selected' : ''}`}
                onClick={() => onViewChange('back')}
            >
                🔄 Espalda
            </button>
        </div>
    )
}

export default ViewToggle

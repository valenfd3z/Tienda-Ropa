import { useRef } from 'react'
import './IconPicker.css'

const IconPicker = ({ selectedIcon, onIconChange }) => {
    const fileInputRef = useRef(null)

    // Professional icons - Using SVG data URLs for better quality
    const defaultIcons = [
        {
            id: 1,
            name: 'Montaña',
            svg: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 80 L40 40 L50 55 L70 20 L90 80 Z' fill='none' stroke='black' stroke-width='3'/%3E%3Ccircle cx='75' cy='30' r='8' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E`
        },
        {
            id: 2,
            name: 'Geométrico',
            svg: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='black' stroke-width='3'/%3E%3Cpolygon points='50,20 70,65 30,65' fill='none' stroke='black' stroke-width='3'/%3E%3C/svg%3E`
        },
        {
            id: 3,
            name: 'Ola',
            svg: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M10 50 Q30 30 50 50 T90 50' fill='none' stroke='black' stroke-width='3'/%3E%3Cpath d='M10 65 Q30 45 50 65 T90 65' fill='none' stroke='black' stroke-width='3'/%3E%3C/svg%3E`
        },
        {
            id: 4,
            name: 'Brújula',
            svg: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='35' fill='none' stroke='black' stroke-width='2'/%3E%3Cpolygon points='50,20 55,50 50,45 45,50' fill='black'/%3E%3Cline x1='50' y1='20' x2='50' y2='30' stroke='black' stroke-width='2'/%3E%3Cline x1='50' y1='70' x2='50' y2='80' stroke='black' stroke-width='2'/%3E%3Cline x1='20' y1='50' x2='30' y2='50' stroke='black' stroke-width='2'/%3E%3Cline x1='70' y1='50' x2='80' y2='50' stroke='black' stroke-width='2'/%3E%3C/svg%3E`
        },
        {
            id: 5,
            name: 'Hoja',
            svg: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 Q70 30 70 60 Q70 80 50 90 Q30 80 30 60 Q30 30 50 10' fill='none' stroke='black' stroke-width='3'/%3E%3Cpath d='M50 10 L50 90' stroke='black' stroke-width='2'/%3E%3Cpath d='M50 30 Q60 40 65 50' fill='none' stroke='black' stroke-width='1.5'/%3E%3Cpath d='M50 50 Q60 55 65 65' fill='none' stroke='black' stroke-width='1.5'/%3E%3C/svg%3E`
        },
        {
            id: 6,
            name: 'Abstracto',
            svg: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cline x1='20' y1='20' x2='80' y2='80' stroke='black' stroke-width='3'/%3E%3Cline x1='80' y1='20' x2='20' y2='80' stroke='black' stroke-width='3'/%3E%3Ccircle cx='50' cy='50' r='20' fill='none' stroke='black' stroke-width='3'/%3E%3C/svg%3E`
        },
    ]

    const handleFileUpload = (e) => {
        const file = e.target.files[0]

        if (!file) return

        // Validate file type
        if (!file.type.includes('png') && !file.type.includes('svg')) {
            alert('Por favor, sube solo archivos PNG o SVG')
            return
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('El archivo es muy grande. Máximo 2MB')
            return
        }

        // Read file and convert to data URL
        const reader = new FileReader()
        reader.onload = (event) => {
            onIconChange(event.target.result)
        }
        reader.readAsDataURL(file)
    }

    const handleIconSelect = (svg) => {
        onIconChange(svg)
    }

    return (
        <div className="icon-picker">
            <div className="default-icons">
                {defaultIcons.map((icon) => (
                    <button
                        key={icon.id}
                        className={`icon-option ${selectedIcon === icon.svg ? 'selected' : ''}`}
                        onClick={() => handleIconSelect(icon.svg)}
                        title={icon.name}
                    >
                        <img src={icon.svg} alt={icon.name} className="icon-preview" />
                    </button>
                ))}
            </div>

            <div className="upload-section">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.svg"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />
                <button
                    className="upload-button"
                    onClick={() => fileInputRef.current?.click()}
                >
                    📤 Subir tu Diseño (PNG/SVG)
                </button>
                <p className="upload-hint">Máx. 2MB • Fondo transparente recomendado</p>
            </div>
        </div>
    )
}

export default IconPicker

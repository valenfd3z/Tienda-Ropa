import { useState } from 'react'
import './ContactButton.css'

const ContactButton = ({ size, shirtColor, view }) => {
    const whatsappNumber = '5491135151153'
    const instagramUser = 'fiebre.clothing'
    const [copied, setCopied] = useState(false)

    const getColorLabel = (color) => {
        const colorMap = {
            '#FFFFFF': 'Blanco',
            '#6B7280': 'Gris Oscuro',
            '#000000': 'Negro',
            '#1E3A8A': 'Azul Marino',
            '#DC2626': 'Rojo',
            '#16A34A': 'Verde',
            '#06B6D4': 'Turquesa',
            '#7C3AED': 'Morado',
            '#EC4899': 'Rosa',
            '#F97316': 'Naranja',
            '#FACC15': 'Amarillo',
        }
        return colorMap[color] || color
    }

    const getMessage = () => {
        return `Hola! Estuve diseñando una remera en tu web:
- Color: ${getColorLabel(shirtColor)}
- Talle: ${size}
- Vista: ${view === 'front' ? 'Frente' : 'Espalda'}
Te adjunto la foto del diseño que descargué.`
    }

    const handleWhatsApp = () => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(getMessage())}`, '_blank')
    }

    const handleInstagram = () => {
        // Copy message to clipboard first to help the user
        navigator.clipboard.writeText(getMessage())
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)

        // Open Instagram DMs or Profile
        // Note: Instagram doesn't support pre-filling messages via URL
        window.open(`https://www.instagram.com/${instagramUser}/`, '_blank')
    }

    return (
        <div className="contact-buttons-container">
            <button className="whatsapp-button" onClick={handleWhatsApp}>
                <span className="icon">💬</span> Consultar por WhatsApp
            </button>
            <button className="instagram-button" onClick={handleInstagram}>
                <span className="icon">📸</span> {copied ? '¡Mensaje Copiado!' : 'Enviar por Instagram'}
            </button>
            <p className="contact-note">
                {copied
                    ? '✅ Mensaje copiado. Ahora pegalo en el chat de Instagram y adjuntá tu diseño.'
                    : '💡 Al tocar Instagram, se copiará un mensaje automático para que lo pegues en el chat.'}
            </p>
        </div>
    )
}

export default ContactButton

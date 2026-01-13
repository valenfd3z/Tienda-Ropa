/*
 * Botones de Contacto - WhatsApp e Instagram con mensaje automático
 */
import { useState } from 'react'
import './BotonContacto.css'

const BotonContacto = ({ talle, colorRemera, vista, tipoPrenda }) => {
    const numeroWhatsApp = '5491135151153'
    const usuarioInstagram = 'fiebre.clothing'
    const [copiado, setCopiado] = useState(false)

    // Mapeo de colores hex a nombres legibles
    const obtenerEtiquetaColor = (color) => {
        const mapaColores = {
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
        return mapaColores[color] || color
    }

    // Genera el mensaje con los detalles de la remera
    const obtenerMensaje = () => {
        const prenda = tipoPrenda === 'musculosa' ? 'Musculosa' : 'Remera'
        return `¡Hola! Estuve diseñando una ${prenda.toLowerCase()} en tu web:
- Tipo: ${prenda}
- Color: ${obtenerEtiquetaColor(colorRemera)}
- Talle: ${talle}
- Vista: ${vista === 'front' ? 'Frente' : 'Espalda'}
Te adjunto la foto del diseño que descargué.`
    }

    const manejarWhatsApp = () => {
        window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(obtenerMensaje())}`, '_blank')
    }

    const manejarInstagram = () => {
        // IG no permite pre-llenar mensajes, así que copiamos al portapapeles
        navigator.clipboard.writeText(obtenerMensaje())
        setCopiado(true)
        setTimeout(() => setCopiado(false), 3000)
        window.open(`https://www.instagram.com/${usuarioInstagram}/`, '_blank')
    }

    return (
        <div className="contenedor-botones-contacto">
            <button className="boton-whatsapp" onClick={manejarWhatsApp}>
                <span className="icono">💬</span> Consultar por WhatsApp
            </button>
            <button className="boton-instagram" onClick={manejarInstagram}>
                <span className="icono">📸</span> {copiado ? '¡Mensaje Copiado!' : 'Enviar por Instagram'}
            </button>
            <p className="nota-contacto">
                {copiado
                    ? '✅ Mensaje copiado. Ahora pegalo en el chat de Instagram y adjuntá tu diseño.'
                    : '💡 Al tocar Instagram, se va a copiar un mensaje automático para que lo pegués en el chat.'}
            </p>
        </div>
    )
}

export default BotonContacto

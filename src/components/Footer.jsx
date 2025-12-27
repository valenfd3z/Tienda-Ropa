import './Footer.css'

const Footer = ({ className }) => {
    return (
        <footer className={`app-footer ${className ? className : ''}`}>
            <div className="footer-content">
                <div className="footer-logo">👕 NAZARENO CUSTOMS</div>
                <p className="footer-thanks">¡Gracias por visitar mi simulador! Espero que hayas podido crear el diseño de tus sueños.</p>
                <div className="footer-divider"></div>
                <p className="footer-copyright">© 2026 Fiebre Clothing. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}



export default Footer

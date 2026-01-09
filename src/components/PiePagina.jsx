/*
 * Pie de Página - Footer con logo y copyright
 */
import './PiePagina.css'

const PiePagina = ({ nombreClase }) => {
    return (
        <footer className={`pie-pagina-app ${nombreClase || ''}`}>
            <div className="contenido-pie">
                <div className="logo-pie">👕 NAZARENO CUSTOMS</div>
                <p className="agradecimiento-pie">¡Gracias por visitar mi simulador! Espero que hayas podido crear el diseño de tus sueños.</p>
                <div className="divisor-pie"></div>
                <p className="copyright-pie">© 2026 Fiebre Clothing. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}

export default PiePagina

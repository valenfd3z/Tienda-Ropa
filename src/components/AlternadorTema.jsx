/*
 * Alternador de Tema - Botón para cambiar entre Claro y Oscuro
 */
import { useEffect, useState } from 'react'
import './AlternadorTema.css'

const AlternadorTema = () => {
    const [tema, setTema] = useState('dark')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', tema)
    }, [tema])

    const alternarTema = () => {
        setTema(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <button
            className="alternador-tema"
            onClick={alternarTema}
            aria-label={`Cambiar a tema ${tema === 'dark' ? 'claro' : 'oscuro'}`}
            title={`Alternar tema ${tema === 'dark' ? 'claro' : 'oscuro'}`}
        >
            <div className={`switch-tema ${tema}`}>
                <span className="icono-tema">{tema === 'dark' ? '🌙' : '☀️'}</span>
            </div>
        </button>
    )
}

export default AlternadorTema

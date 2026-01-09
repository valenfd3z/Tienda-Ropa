/*
 * Punto de entrada de la aplicación React.
 * Monta el componente principal en el DOM.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import Aplicacion from './Aplicacion.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Aplicacion />
    </React.StrictMode>,
)

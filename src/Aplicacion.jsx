/*
 * Componente principal - Simulador de Remeras Nazareno Customs
 * Maneja el estado global: color, talle, vista y diseño seleccionado.
 */
import { useState } from 'react'
import './Aplicacion.css'
import LienzoRemera from './components/LienzoRemera'
import SelectorColor from './components/SelectorColor'
import SelectorTalle from './components/SelectorTalle'
import AlternadorVista from './components/AlternadorVista'
import SelectorIcono from './components/SelectorIcono'
import ControlesIcono from './components/ControlesIcono'
import BotonExportar from './components/BotonExportar'
import BotonContacto from './components/BotonContacto'
import Particulas from './components/Particulas'
import ComoUsar from './components/ComoUsar'
import PiePagina from './components/PiePagina'
import SelectorTipoPrenda from './components/SelectorTipoPrenda'

function Aplicacion() {
    // Estado de la remera
    const [colorRemera, setColorRemera] = useState('#FFFFFF')
    const [talle, setTalle] = useState('M')
    const [vista, setVista] = useState('front')
    const [tipoPrenda, setTipoPrenda] = useState('tshirt')

    // Estado de estampas por lado
    const [estampas, setEstampas] = useState({
        front: { icono: null, posicion: { x: 300, y: 375 }, tamanio: 150 },
        back: { icono: null, posicion: { x: 300, y: 375 }, tamanio: 150 }
    })

    // Referencias y UI
    const [refCanvas, setRefCanvas] = useState(null)
    const [mostrarSeleccion, setMostrarSeleccion] = useState(true)
    const [estaModalAbierto, setEstaModalAbierto] = useState(false)
    const [estaEnVistaPrevia, setEstaEnVistaPrevia] = useState(false)

    // Funciones de actualización para la estampa actual
    const actualizarEstampaActual = (cambios) => {
        setEstampas(prev => ({
            ...prev,
            [vista]: { ...prev[vista], ...cambios }
        }))
    }

    const estampaActual = estampas[vista]

    // Mapeo de colores hex a nombres (para rutas de imágenes)
    const obtenerNombreColor = (color) => {
        const mapaColores = {
            '#FFFFFF': 'white',
            '#6B7280': 'darkgray',
            '#000000': 'black',
            '#1E3A8A': 'navy',
            '#DC2626': 'red',
            '#16A34A': 'green',
            '#06B6D4': 'turquoise',
            '#7C3AED': 'purple',
            '#EC4899': 'pink',
            '#F97316': 'orange',
            '#FACC15': 'yellow',
        }
        return mapaColores[color] || 'white'
    }

    return (
        <div className="aplicacion">
            <Particulas />

            <header className="cabecera-app">
                <div className="cabecera-superior">
                    <h1>👕 NAZARENO CUSTOMS</h1>
                </div>
                <p>Simulador de remeras estampadas premium</p>
                <button className="boton-ayuda" onClick={() => setEstaModalAbierto(true)}>
                    ❓ CÓMO USAR
                </button>
            </header>

            <ComoUsar estaAbierto={estaModalAbierto} alCerrar={() => setEstaModalAbierto(false)} />

            <section className="seccion-intro">
                <div className="contenido-intro">
                    <h2>🧢 ¡Hola! Soy Nazareno</h2>
                    <p>Tu diseñador de confianza para <strong>remeras estampadas personalizadas</strong>.</p>
                    <p>Podés escribirme directamente o usar este simulador para darle vida a tu idea.</p>
                    <p><strong>¡Hagamos que tu estilo destaque!</strong></p>
                </div>
            </section>

            <div className="contenedor-app">
                <div className="seccion-lienzo">
                    <LienzoRemera
                        colorRemera={colorRemera}
                        vista={vista}
                        tipoPrenda={tipoPrenda}
                        urlImagenRemeraPersonalizada={null}
                        estampas={estampas}
                        mostrarSeleccion={mostrarSeleccion}
                        estaEnVistaPrevia={estaEnVistaPrevia}
                        talle={talle}
                        alPrepararLienzo={setRefCanvas}
                        alCambiarPosicionIcono={(posicion) => actualizarEstampaActual({ posicion })}
                    />
                </div>

                <div className="seccion-controles">
                    <div className="grupo-control">
                        <h3>Tipo de Prenda</h3>
                        <SelectorTipoPrenda tipoSeleccionado={tipoPrenda} alCambiarTipo={setTipoPrenda} />
                    </div>

                    <div className="grupo-control">
                        <h3>Vista de la Prenda</h3>
                        <AlternadorVista vista={vista} alCambiarVista={setVista} />
                    </div>

                    <div className="grupo-control">
                        <h3>Color de la Remera</h3>
                        <SelectorColor colorSeleccionado={colorRemera} alCambiarColor={setColorRemera} />
                    </div>

                    <div className="grupo-control">
                        <h3>Elegí el Talle</h3>
                        <SelectorTalle talleSeleccionado={talle} alCambiarTalle={setTalle} />
                    </div>

                    <div className="grupo-control">
                        <h3>Elegí tu Diseño ({vista === 'front' ? 'FRENTE' : 'ESPALDA'})</h3>
                        <SelectorIcono
                            iconoSeleccionado={estampaActual.icono}
                            alCambiarIcono={(icono) => actualizarEstampaActual({ icono })}
                        />
                    </div>

                    {estampaActual.icono && (
                        <div className="grupo-control">
                            <h3>Ajustar Diseño</h3>
                            <ControlesIcono
                                tamanioIcono={estampaActual.tamanio}
                                alCambiarTamanioIcono={(tamanio) => actualizarEstampaActual({ tamanio })}
                                mostrarSeleccion={mostrarSeleccion}
                                alAlternarSeleccion={() => setMostrarSeleccion(!mostrarSeleccion)}
                                alReiniciarPosicion={() => actualizarEstampaActual({ posicion: { x: 300, y: 375 } })}
                                alLimpiarIcono={() => actualizarEstampaActual({ icono: null })}
                            />
                        </div>
                    )}

                    <div className="botones-accion">
                        <button
                            className={`boton-vista-previa ${estaEnVistaPrevia ? 'activo' : ''}`}
                            onClick={() => setEstaEnVistaPrevia(!estaEnVistaPrevia)}
                        >
                            {estaEnVistaPrevia ? '🛑 DETENER VISTA 3D' : '🎬 VISTA PREVIA 3D'}
                        </button>
                        <BotonExportar
                            refCanvas={refCanvas}
                            colorRemera={colorRemera}
                            talle={talle}
                            estampas={estampas}
                            tipoPrenda={tipoPrenda}
                        />
                        <BotonContacto
                            talle={talle}
                            colorRemera={colorRemera}
                            vista={vista}
                            tipoPrenda={tipoPrenda}
                        />
                    </div>

                    <PiePagina nombreClase="pie-pagina-movil" />
                </div>
            </div>

            <PiePagina nombreClase="pie-pagina-escritorio" />
        </div>
    )
}

export default Aplicacion


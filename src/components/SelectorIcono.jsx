/*
 * Selector de Icono - Cuadrícula de diseños predeterminados y carga personalizada
 */
import { useRef } from 'react'
import './SelectorIcono.css'

const SelectorIcono = ({ iconoSeleccionado, alCambiarIcono }) => {
    const refEntradaArchivo = useRef(null)

    // Diseños predeterminados (PNG)
    const iconosPredeterminados = [
        { id: 1, nombre: 'Itachi', src: '/assets/iconos/itachi.png' },
        { id: 2, nombre: 'Nirvana', src: '/assets/iconos/nirvana.png' },
        { id: 3, nombre: 'Luffy', src: '/assets/iconos/luffy.png' },
        { id: 4, nombre: 'The Beatles', src: '/assets/iconos/beatles.png' },
        { id: 5, nombre: 'Homero', src: '/assets/iconos/homero.png' },
        { id: 6, nombre: 'Snoopy', src: '/assets/iconos/snoopy.png' },
    ]

    // Validación y carga de archivos personalizados
    const manejarCargaArchivo = (e) => {
        const archivo = e.target.files[0]
        if (!archivo) return

        if (!archivo.type.includes('png') && !archivo.type.includes('svg')) {
            alert('Por favor, subí solo archivos PNG o SVG')
            return
        }

        if (archivo.size > 2 * 1024 * 1024) {
            alert('El archivo es muy grande. El tamaño máximo permitido es 2MB')
            return
        }

        const lector = new FileReader()
        lector.onload = (evento) => {
            alCambiarIcono({ src: evento.target.result, isPreset: false })
        }
        lector.readAsDataURL(archivo)
    }

    const seleccionarIcono = (src) => {
        // En este caso, isPreset ya no debería disparar la inversión de colores en LienzoRemera
        // porque son imágenes a color, no vectores monocromáticos.
        alCambiarIcono({ src, isPreset: true })
    }

    return (
        <div className="selector-icono">
            <div className="iconos-predeterminados">
                {iconosPredeterminados.map((icono) => (
                    <button
                        key={icono.id}
                        className={`opcion-icono ${iconoSeleccionado?.src === icono.src ? 'seleccionado' : ''}`}
                        onClick={() => seleccionarIcono(icono.src)}
                        title={icono.nombre}
                    >
                        <img src={icono.src} alt={icono.nombre} className="previsualizacion-icono" />
                    </button>
                ))}
            </div>

            <div className="seccion-carga">
                <input
                    ref={refEntradaArchivo}
                    type="file"
                    accept="image/png, image/svg+xml"
                    onChange={manejarCargaArchivo}
                    style={{ display: 'none' }}
                />
                <button
                    className="boton-carga"
                    onClick={() => refEntradaArchivo.current?.click()}
                >
                    📤 Subir tu Diseño (PNG/SVG)
                </button>
                <p className="pista-carga">Máx. 2MB • Se recomienda fondo transparente</p>
                <p className="recomendacion-carga">
                    💡 ¿No tenés imágenes con fondo transparente? Buscá en{' '}
                    <a href="https://pngimg.com/" target="_blank" rel="noopener noreferrer">
                        pngimg.com
                    </a>
                </p>
            </div>
        </div>
    )
}

export default SelectorIcono

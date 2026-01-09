/*
 * Lienzo de la Remera - Canvas principal con renderizado, drag & drop y procesamiento de imágenes
 * Maneja: eliminación de fondo, teñido de colores, arrastre del diseño y exportación
 */
import { useEffect, useRef, useState, useCallback } from 'react'
import './LienzoRemera.css'

const LienzoRemera = ({
    colorRemera,
    vista,
    urlImagenRemeraPersonalizada,
    iconoSeleccionado,
    posicionIcono,
    tamanioIcono,
    mostrarSeleccion,
    talle,
    alPrepararLienzo,
    alCambiarPosicionIcono
}) => {
    const refCanvas = useRef(null)
    const refContenedor = useRef(null)
    const [estaArrastrando, setEstaArrastrando] = useState(false)
    const [desfaseArrastre, setDesfaseArrastre] = useState({ x: 0, y: 0 })
    const [estaEnTransicion, setEstaEnTransicion] = useState(false)

    // Cache para evitar re-procesar imágenes
    const refCacheImagenes = useRef({})
    const refRemerasProcesadas = useRef({})

    // Ref para acceder al estado actual desde event listeners
    const refEstadoInterno = useRef({
        posicionIcono,
        iconoSeleccionado,
        tamanioIcono,
        alCambiarPosicionIcono
    })

    useEffect(() => {
        refEstadoInterno.current = {
            posicionIcono,
            iconoSeleccionado,
            tamanioIcono,
            alCambiarPosicionIcono
        }
    }, [posicionIcono, iconoSeleccionado, tamanioIcono, alCambiarPosicionIcono])

    // Touch events con passive: false para bloquear scroll durante arrastre
    useEffect(() => {
        const canvas = refCanvas.current
        if (!canvas) return

        let localEstaArrastrando = false
        let localDesfaseArrastre = { x: 0, y: 0 }

        const alIniciarToque = (e) => {
            const { iconoSeleccionado, posicionIcono, tamanioIcono } = refEstadoInterno.current
            if (!iconoSeleccionado) return

            const rect = canvas.getBoundingClientRect()
            const toque = e.touches[0]
            const x = (toque.clientX - rect.left) * (canvas.width / rect.width)
            const y = (toque.clientY - rect.top) * (canvas.height / rect.height)

            // Verificar si el toque está sobre el diseño
            if (x >= posicionIcono.x - tamanioIcono / 2 && x <= posicionIcono.x + tamanioIcono / 2 &&
                y >= posicionIcono.y - tamanioIcono / 2 && y <= posicionIcono.y + tamanioIcono / 2) {

                e.preventDefault()
                localEstaArrastrando = true
                localDesfaseArrastre = { x: x - posicionIcono.x, y: y - posicionIcono.y }

                setEstaArrastrando(true)
                setDesfaseArrastre(localDesfaseArrastre)
            }
        }

        const alMoverToque = (e) => {
            if (!localEstaArrastrando) return
            e.preventDefault()

            const { tamanioIcono, alCambiarPosicionIcono } = refEstadoInterno.current
            const rect = canvas.getBoundingClientRect()
            const toque = e.touches[0]
            const x = (toque.clientX - rect.left) * (canvas.width / rect.width)
            const y = (toque.clientY - rect.top) * (canvas.height / rect.height)

            // Limitar posición dentro del canvas
            alCambiarPosicionIcono({
                x: Math.max(tamanioIcono / 2, Math.min(canvas.width - tamanioIcono / 2, x - localDesfaseArrastre.x)),
                y: Math.max(tamanioIcono / 2, Math.min(canvas.height - tamanioIcono / 2, y - localDesfaseArrastre.y))
            })
        }

        const alFinalizarToque = () => {
            localEstaArrastrando = false
            setEstaArrastrando(false)
        }

        canvas.addEventListener('touchstart', alIniciarToque, { passive: false })
        canvas.addEventListener('touchmove', alMoverToque, { passive: false })
        canvas.addEventListener('touchend', alFinalizarToque)
        canvas.addEventListener('touchcancel', alFinalizarToque)

        return () => {
            canvas.removeEventListener('touchstart', alIniciarToque)
            canvas.removeEventListener('touchmove', alMoverToque)
            canvas.removeEventListener('touchend', alFinalizarToque)
            canvas.removeEventListener('touchcancel', alFinalizarToque)
        }
    }, [])

    // Notificar cuando el canvas esté listo
    useEffect(() => {
        if (refCanvas.current) {
            alPrepararLienzo(refCanvas.current)
        }
    }, [alPrepararLienzo])

    // Animación de transición al cambiar vista/color
    useEffect(() => {
        setEstaEnTransicion(true)
        const timer = setTimeout(() => setEstaEnTransicion(false), 400)
        return () => clearTimeout(timer)
    }, [vista, colorRemera])

    // --- Funciones auxiliares ---

    const obtenerUrlRemeraBase = (vista) => `/assets/tshirts/tshirt-${vista}-white.png`

    const esColorOscuro = (color) => {
        const coloresOscuros = ['#6B7280', '#000000', '#1E3A8A', '#DC2626', '#16A34A', '#7C3AED', '#EC4899', '#F97316']
        return coloresOscuros.includes(color)
    }

    // Elimina el fondo de la imagen con algoritmo de proximidad de color
    const eliminarFondo = (img) => {
        const llaveCache = img.src + colorRemera
        if (refRemerasProcesadas.current[llaveCache]) return refRemerasProcesadas.current[llaveCache]

        const lienzoTemp = document.createElement('canvas')
        const ctxTemp = lienzoTemp.getContext('2d')
        lienzoTemp.width = img.width
        lienzoTemp.height = img.height
        ctxTemp.drawImage(img, 0, 0)

        const datosImagen = ctxTemp.getImageData(0, 0, lienzoTemp.width, lienzoTemp.height)
        const pixeles = datosImagen.data
        const ancho = lienzoTemp.width
        const alto = lienzoTemp.height

        // Muestrear colores de fondo desde los bordes
        const coloresFondo = []
        const coloresVistos = new Set()

        const agregarMuestra = (r, g, b) => {
            const llave = `${Math.round(r / 5)},${Math.round(g / 5)},${Math.round(b / 5)}`
            if (!coloresVistos.has(llave)) {
                coloresVistos.add(llave)
                coloresFondo.push([r, g, b])
            }
        }

        const obtenerPixel = (x, y) => {
            const i = (y * ancho + x) * 4
            return [pixeles[i], pixeles[i + 1], pixeles[i + 2]]
        }

        const pasoBorde = 10
        for (let x = 0; x < ancho; x += pasoBorde) {
            const p1 = obtenerPixel(x, 0); agregarMuestra(p1[0], p1[1], p1[2]);
            const p2 = obtenerPixel(x, alto - 1); agregarMuestra(p2[0], p2[1], p2[2]);
        }
        for (let y = 0; y < alto; y += pasoBorde) {
            const p1 = obtenerPixel(0, y); agregarMuestra(p1[0], p1[1], p1[2]);
            const p2 = obtenerPixel(ancho - 1, y); agregarMuestra(p2[0], p2[1], p2[2]);
        }

        // Tolerancia ajustada según el color
        let tolerancia = 60
        let suavizado = 10
        if (colorRemera === '#6B7280') tolerancia = 50
        else if (colorRemera === '#000000' || colorRemera === '#1E3A8A') tolerancia = 60
        else if (colorRemera === '#DC2626') tolerancia = 70

        for (let i = 0; i < pixeles.length; i += 4) {
            const r = pixeles[i], g = pixeles[i + 1], b = pixeles[i + 2]

            let distMin = 1000
            for (const bg of coloresFondo) {
                const dist = Math.sqrt(Math.pow(r - bg[0], 2) + Math.pow(g - bg[1], 2) + Math.pow(b - bg[2], 2))
                if (dist < distMin) distMin = dist
            }

            if (distMin < tolerancia - suavizado) {
                pixeles[i + 3] = 0
            } else if (distMin < tolerancia) {
                const proporcion = (distMin - (tolerancia - suavizado)) / suavizado
                pixeles[i + 3] = proporcion * 255
            }
        }

        // Suavizado de bordes (edge matting)
        const alphaOriginal = new Uint8Array(pixeles.length / 4)
        for (let i = 0; i < pixeles.length; i += 4) alphaOriginal[i / 4] = pixeles[i + 3]

        for (let y = 2; y < alto - 2; y++) {
            for (let x = 2; x < ancho - 2; x++) {
                const i = (y * ancho + x) * 4
                if (pixeles[i + 3] > 0) {
                    let sumaAlpha = 0
                    let contador = 0
                    for (let ny = -2; ny <= 2; ny++) {
                        for (let nx = -2; nx <= 2; nx++) {
                            sumaAlpha += alphaOriginal[(y + ny) * ancho + (x + nx)]
                            contador++
                        }
                    }
                    const promedioAlpha = sumaAlpha / contador
                    if (promedioAlpha < 250) {
                        pixeles[i + 3] = (pixeles[i + 3] * 0.2) + (promedioAlpha * 0.8)
                    }
                }
            }
        }

        ctxTemp.putImageData(datosImagen, 0, 0)
        refRemerasProcesadas.current[llaveCache] = lienzoTemp
        return lienzoTemp
    }

    // Aplica tinte de color preservando sombras (modo multiply)
    const tenirRemera = (remeraProcesada, color) => {
        const llaveCache = `tinte|${color}|${remeraProcesada.width}x${remeraProcesada.height}|${remeraProcesada.__src || ''}`
        if (refRemerasProcesadas.current[llaveCache]) return refRemerasProcesadas.current[llaveCache]

        const lienzoTemp = document.createElement('canvas')
        const ctxTemp = lienzoTemp.getContext('2d')
        lienzoTemp.width = remeraProcesada.width
        lienzoTemp.height = remeraProcesada.height

        ctxTemp.clearRect(0, 0, lienzoTemp.width, lienzoTemp.height)
        ctxTemp.globalCompositeOperation = 'source-over'
        ctxTemp.drawImage(remeraProcesada, 0, 0)

        ctxTemp.globalCompositeOperation = 'multiply'
        ctxTemp.fillStyle = color
        ctxTemp.fillRect(0, 0, lienzoTemp.width, lienzoTemp.height)

        ctxTemp.globalCompositeOperation = 'destination-in'
        ctxTemp.drawImage(remeraProcesada, 0, 0)
        ctxTemp.globalCompositeOperation = 'source-over'

        refRemerasProcesadas.current[llaveCache] = lienzoTemp
        return lienzoTemp
    }

    // Renderizado principal del canvas
    const renderizar = useCallback((forzarMostrarSeleccion = mostrarSeleccion) => {
        const canvas = refCanvas.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const urlRemera = urlImagenRemeraPersonalizada || obtenerUrlRemeraBase(vista)

        const dibujarTodo = (imgRemera, imgIcono) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            if (imgRemera) {
                const remeraSinFondo = eliminarFondo(imgRemera)
                if (!remeraSinFondo.__src) remeraSinFondo.__src = imgRemera.src

                const remeraFinal = (colorRemera !== '#FFFFFF') ? tenirRemera(remeraSinFondo, colorRemera) : remeraSinFondo
                const relacionAspecto = remeraFinal.width / remeraFinal.height

                let sW, sH, sX, sY
                const escala = 0.92
                sW = canvas.width * escala
                sH = sW / relacionAspecto

                if (sH > canvas.height * 0.92) {
                    sH = canvas.height * 0.92
                    sW = sH * relacionAspecto
                }

                sX = (canvas.width - sW) / 2
                sY = (canvas.height - sH) / 2

                // Sombra blanca para remeras negras (mejor contraste)
                if (colorRemera === '#000000') {
                    ctx.save()
                    ctx.shadowColor = 'rgba(255,255,255,0.85)'
                    ctx.shadowBlur = 4
                    ctx.drawImage(remeraFinal, sX, sY, sW, sH)
                    ctx.restore()
                }

                // Sombra principal
                ctx.save()
                ctx.shadowColor = 'rgba(0,0,0,0.6)'
                ctx.shadowBlur = 3
                ctx.shadowOffsetY = 2
                ctx.drawImage(remeraFinal, sX, sY, sW, sH)
                ctx.restore()

                ctx.drawImage(remeraFinal, sX, sY, sW, sH)
            }

            // Dibujar diseño/estampa
            if (imgIcono && iconoSeleccionado) {
                ctx.save()
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
                ctx.shadowBlur = 10
                ctx.shadowOffsetY = 3

                ctx.drawImage(
                    imgIcono,
                    posicionIcono.x - tamanioIcono / 2,
                    posicionIcono.y - tamanioIcono / 2,
                    tamanioIcono,
                    tamanioIcono
                )
                ctx.restore()

                // Borde de selección punteado
                if (forzarMostrarSeleccion) {
                    ctx.strokeStyle = 'rgba(102, 126, 234, 0.8)'
                    ctx.lineWidth = 2
                    ctx.setLineDash([5, 5])
                    ctx.strokeRect(
                        posicionIcono.x - tamanioIcono / 2,
                        posicionIcono.y - tamanioIcono / 2,
                        tamanioIcono,
                        tamanioIcono
                    )
                    ctx.setLineDash([])
                }
            }

            // Labels informativos
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
            ctx.font = 'bold 14px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(vista === 'front' ? 'FRENTE' : 'ESPALDA', canvas.width / 2, canvas.height - 15)

            ctx.textAlign = 'left'
            ctx.font = 'bold 18px sans-serif'
            ctx.fillText(`TALLE: ${talle}`, 20, 35)
        }

        const cargarImagen = (url) => {
            if (refCacheImagenes.current[url]) return Promise.resolve(refCacheImagenes.current[url])
            return new Promise((resolve) => {
                const img = new Image()
                img.crossOrigin = 'anonymous'
                img.onload = () => {
                    refCacheImagenes.current[url] = img
                    resolve(img)
                }
                img.src = url
            })
        }

        Promise.all([
            cargarImagen(urlRemera),
            iconoSeleccionado ? cargarImagen(iconoSeleccionado.src) : Promise.resolve(null)
        ]).then(([imgRemera, imgIcono]) => {
            dibujarTodo(imgRemera, imgIcono)
        })
    }, [colorRemera, vista, iconoSeleccionado, posicionIcono, tamanioIcono, mostrarSeleccion, talle, urlImagenRemeraPersonalizada])

    useEffect(() => {
        renderizar()
    }, [renderizar])

    // Exponer método para renderizar sin selección (para exportar)
    useEffect(() => {
        if (refCanvas.current) {
            refCanvas.current.renderWithoutSelection = () => renderizar(false)
        }
    }, [renderizar])

    // Mouse events para desktop
    const manejarMouseDown = (e) => {
        if (!iconoSeleccionado) return
        const rect = refCanvas.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (refCanvas.current.width / rect.width)
        const y = (e.clientY - rect.top) * (refCanvas.current.height / rect.height)

        if (x >= posicionIcono.x - tamanioIcono / 2 && x <= posicionIcono.x + tamanioIcono / 2 &&
            y >= posicionIcono.y - tamanioIcono / 2 && y <= posicionIcono.y + tamanioIcono / 2) {
            setEstaArrastrando(true)
            setDesfaseArrastre({ x: x - posicionIcono.x, y: y - posicionIcono.y })
        }
    }

    const manejarMouseMove = (e) => {
        if (!estaArrastrando) return
        const rect = refCanvas.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (refCanvas.current.width / rect.width)
        const y = (e.clientY - rect.top) * (refCanvas.current.height / rect.height)

        alCambiarPosicionIcono({
            x: Math.max(tamanioIcono / 2, Math.min(refCanvas.current.width - tamanioIcono / 2, x - desfaseArrastre.x)),
            y: Math.max(tamanioIcono / 2, Math.min(refCanvas.current.height - tamanioIcono / 2, y - desfaseArrastre.y))
        })
    }

    return (
        <div className="contenedor-lienzo-remera" ref={refContenedor}>
            <div className="instrucciones-lienzo">
                <p>💡 <strong>Arrastrá el diseño</strong> para posicionarlo.</p>
            </div>
            <canvas
                ref={refCanvas}
                width={600}
                height={750}
                className={`lienzo-remera ${estaEnTransicion ? 'en-transicion' : ''}`}
                onMouseDown={manejarMouseDown}
                onMouseMove={manejarMouseMove}
                onMouseUp={() => setEstaArrastrando(false)}
                onMouseLeave={() => setEstaArrastrando(false)}
                style={{ cursor: estaArrastrando ? 'grabbing' : (iconoSeleccionado ? 'grab' : 'default') }}
            />
        </div>
    )
}

export default LienzoRemera

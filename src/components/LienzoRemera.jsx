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
    estampas,
    mostrarSeleccion,
    talle,
    alPrepararLienzo,
    alCambiarPosicionIcono
}) => {
    const refCanvasFront = useRef(null)
    const refCanvasBack = useRef(null)
    const refContenedor = useRef(null)
    const [estaArrastrando, setEstaArrastrando] = useState(false)
    const [desfaseArrastre, setDesfaseArrastre] = useState({ x: 0, y: 0 })

    // Cache para evitar re-procesar imágenes
    const refCacheImagenes = useRef({})
    const refRemerasProcesadas = useRef({})

    // Ref para acceder al estado actual desde event listeners
    const refEstadoInterno = useRef({
        estampas,
        vista,
        alCambiarPosicionIcono
    })

    useEffect(() => {
        refEstadoInterno.current = {
            estampas,
            vista,
            alCambiarPosicionIcono
        }
    }, [estampas, vista, alCambiarPosicionIcono])

    // Touch events
    useEffect(() => {
        const manejarTouch = (e, canvasRef) => {
            const canvas = canvasRef.current
            if (!canvas || refEstadoInterno.current.vista !== (canvas === refCanvasFront.current ? 'front' : 'back')) return

            const { estampas, vista } = refEstadoInterno.current
            const estampaActual = estampas[vista]
            if (!estampaActual.icono) return

            const rect = canvas.getBoundingClientRect()
            const toque = e.touches[0]
            const x = (toque.clientX - rect.left) * (canvas.width / rect.width)
            const y = (toque.clientY - rect.top) * (canvas.height / rect.height)

            if (e.type === 'touchstart') {
                if (x >= estampaActual.posicion.x - estampaActual.tamanio / 2 && x <= estampaActual.posicion.x + estampaActual.tamanio / 2 &&
                    y >= estampaActual.posicion.y - estampaActual.tamanio / 2 && y <= estampaActual.posicion.y + estampaActual.tamanio / 2) {
                    e.preventDefault()
                    setEstaArrastrando(true)
                    setDesfaseArrastre({ x: x - estampaActual.posicion.x, y: y - estampaActual.posicion.y })
                }
            } else if (e.type === 'touchmove' && estaArrastrando) {
                e.preventDefault()
                const { alCambiarPosicionIcono } = refEstadoInterno.current
                alCambiarPosicionIcono({
                    x: Math.max(estampaActual.tamanio / 2, Math.min(canvas.width - estampaActual.tamanio / 2, x - desfaseArrastre.x)),
                    y: Math.max(estampaActual.tamanio / 2, Math.min(canvas.height - estampaActual.tamanio / 2, y - desfaseArrastre.y))
                })
            }
        }

        const front = refCanvasFront.current
        const back = refCanvasBack.current

        const fStart = (e) => manejarTouch(e, refCanvasFront)
        const fMove = (e) => manejarTouch(e, refCanvasFront)
        const bStart = (e) => manejarTouch(e, refCanvasBack)
        const bMove = (e) => manejarTouch(e, refCanvasBack)
        const end = () => setEstaArrastrando(false)

        front?.addEventListener('touchstart', fStart, { passive: false })
        front?.addEventListener('touchmove', fMove, { passive: false })
        back?.addEventListener('touchstart', bStart, { passive: false })
        back?.addEventListener('touchmove', bMove, { passive: false })
        window.addEventListener('touchend', end)

        return () => {
            front?.removeEventListener('touchstart', fStart)
            front?.removeEventListener('touchmove', fMove)
            back?.removeEventListener('touchstart', bStart)
            back?.removeEventListener('touchmove', bMove)
            window.removeEventListener('touchend', end)
        }
    }, [estaArrastrando, desfaseArrastre])

    // Notificar cuando el canvas esté listo (usamos el frontal como referencia principal)
    useEffect(() => {
        if (refCanvasFront.current) {
            alPrepararLienzo(refCanvasFront.current)
        }
    }, [alPrepararLienzo])

    // --- Funciones auxiliares ---
    const obtenerUrlRemeraBase = (v) => `/assets/tshirts/tshirt-${v}-white.png`

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
            if (distMin < tolerancia - suavizado) pixeles[i + 3] = 0
            else if (distMin < tolerancia) pixeles[i + 3] = ((distMin - (tolerancia - suavizado)) / suavizado) * 255
        }

        ctxTemp.putImageData(datosImagen, 0, 0)
        refRemerasProcesadas.current[llaveCache] = lienzoTemp
        return lienzoTemp
    }

    const tenirRemera = (remeraProcesada, color) => {
        const llaveCache = `tinte|${color}|${remeraProcesada.width}x${remeraProcesada.height}|${remeraProcesada.__src || ''}`
        if (refRemerasProcesadas.current[llaveCache]) return refRemerasProcesadas.current[llaveCache]

        const lienzoTemp = document.createElement('canvas')
        const ctxTemp = lienzoTemp.getContext('2d')
        lienzoTemp.width = remeraProcesada.width
        lienzoTemp.height = remeraProcesada.height

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

    const renderizarCara = useCallback((canvas, v, diseno, forzarMostrarSeleccion) => {
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const urlRemera = obtenerUrlRemeraBase(v)

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

                if (colorRemera === '#000000') {
                    ctx.save()
                    ctx.shadowColor = 'rgba(255,255,255,0.85)'
                    ctx.shadowBlur = 4
                    ctx.drawImage(remeraFinal, sX, sY, sW, sH)
                    ctx.restore()
                }

                ctx.save()
                ctx.shadowColor = 'rgba(0,0,0,0.6)'
                ctx.shadowBlur = 3
                ctx.shadowOffsetY = 2
                ctx.drawImage(remeraFinal, sX, sY, sW, sH)
                ctx.restore()

                ctx.drawImage(remeraFinal, sX, sY, sW, sH)
            }

            if (imgIcono && diseno.icono) {
                ctx.save()
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
                ctx.shadowBlur = 10
                ctx.shadowOffsetY = 3
                ctx.drawImage(imgIcono, diseno.posicion.x - diseno.tamanio / 2, diseno.posicion.y - diseno.tamanio / 2, diseno.tamanio, diseno.tamanio)
                ctx.restore()

                if (forzarMostrarSeleccion && v === vista) {
                    ctx.strokeStyle = 'rgba(102, 126, 234, 0.8)'
                    ctx.lineWidth = 2
                    ctx.setLineDash([5, 5])
                    ctx.strokeRect(diseno.posicion.x - diseno.tamanio / 2, diseno.posicion.y - diseno.tamanio / 2, diseno.tamanio, diseno.tamanio)
                    ctx.setLineDash([])
                }
            }

            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
            ctx.font = 'bold 14px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(v === 'front' ? 'FRENTE' : 'ESPALDA', canvas.width / 2, canvas.height - 15)
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
            diseno.icono ? cargarImagen(diseno.icono.src) : Promise.resolve(null)
        ]).then(([imgRemera, imgIcono]) => dibujarTodo(imgRemera, imgIcono))
    }, [colorRemera, talle, vista])

    useEffect(() => {
        renderizarCara(refCanvasFront.current, 'front', estampas.front, mostrarSeleccion)
        renderizarCara(refCanvasBack.current, 'back', estampas.back, mostrarSeleccion)
    }, [renderizarCara, estampas, mostrarSeleccion])

    const manejarMouseDown = (v, e, canvasRef) => {
        if (v !== vista) return
        const canvas = canvasRef.current
        const estampaActual = estampas[v]
        if (!estampaActual.icono) return
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (canvas.width / rect.width)
        const y = (e.clientY - rect.top) * (canvas.height / rect.height)

        if (x >= estampaActual.posicion.x - estampaActual.tamanio / 2 && x <= estampaActual.posicion.x + estampaActual.tamanio / 2 &&
            y >= estampaActual.posicion.y - estampaActual.tamanio / 2 && y <= estampaActual.posicion.y + estampaActual.tamanio / 2) {
            setEstaArrastrando(true)
            setDesfaseArrastre({ x: x - estampaActual.posicion.x, y: y - estampaActual.posicion.y })
        }
    }

    const manejarMouseMove = (v, e, canvasRef) => {
        if (!estaArrastrando || v !== vista) return
        const canvas = canvasRef.current
        const estampaActual = estampas[v]
        const rect = canvas.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (canvas.width / rect.width)
        const y = (e.clientY - rect.top) * (canvas.height / rect.height)

        alCambiarPosicionIcono({
            x: Math.max(estampaActual.tamanio / 2, Math.min(canvas.width - estampaActual.tamanio / 2, x - desfaseArrastre.x)),
            y: Math.max(estampaActual.tamanio / 2, Math.min(canvas.height - estampaActual.tamanio / 2, y - desfaseArrastre.y))
        })
    }

    return (
        <div className="contenedor-lienzo-remera" ref={refContenedor}>
            <div className="instrucciones-lienzo">
                <p>💡 <strong>Arrastrá el diseño</strong> para posicionarlo.</p>
            </div>
            <div className={`tarjeta-remera ${vista === 'back' ? 'girada' : ''}`}>
                <div className="tarjeta-remera-interna">
                    <div className="cara-remera cara-frontal">
                        <canvas
                            ref={refCanvasFront}
                            width={600}
                            height={750}
                            className="lienzo-remera"
                            onMouseDown={(e) => manejarMouseDown('front', e, refCanvasFront)}
                            onMouseMove={(e) => manejarMouseMove('front', e, refCanvasFront)}
                            onMouseUp={() => setEstaArrastrando(false)}
                            onMouseLeave={() => setEstaArrastrando(false)}
                            style={{ cursor: vista === 'front' && estampas.front.icono ? (estaArrastrando ? 'grabbing' : 'grab') : 'default' }}
                        />
                    </div>
                    <div className="cara-remera cara-trasera">
                        <canvas
                            ref={refCanvasBack}
                            width={600}
                            height={750}
                            className="lienzo-remera"
                            onMouseDown={(e) => manejarMouseDown('back', e, refCanvasBack)}
                            onMouseMove={(e) => manejarMouseMove('back', e, refCanvasBack)}
                            onMouseUp={() => setEstaArrastrando(false)}
                            onMouseLeave={() => setEstaArrastrando(false)}
                            style={{ cursor: vista === 'back' && estampas.back.icono ? (estaArrastrando ? 'grabbing' : 'grab') : 'default' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LienzoRemera

/*
 * Lienzo de la Remera - Canvas principal con renderizado, drag & drop y procesamiento de imágenes
 * Maneja: eliminación de fondo, teñido de colores, arrastre del diseño y exportación
 */
import { useEffect, useRef, useState, useCallback } from 'react'
import { eliminarFondo, tenirRemera } from '../utils/procesamientoImagen'
import './LienzoRemera.css'

const LienzoRemera = ({
    colorRemera,
    vista,
    tipoPrenda,
    urlImagenRemeraPersonalizada,
    estampas,
    mostrarSeleccion,
    estaEnVistaPrevia,
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
    const obtenerUrlRemeraBase = (v) => `/assets/tshirts/${tipoPrenda}-${v}-white.png`

    const refRemeraFinalCache = useRef({ front: null, back: null, params: '' })
    const refVersionRender = useRef({ front: 0, back: 0 })

    const renderizarCara = useCallback(async (canvas, v, diseno, forzarMostrarSeleccion) => {
        if (!canvas) return

        const versionActual = ++refVersionRender.current[v]
        const ctx = canvas.getContext('2d')
        const esMobile = window.innerWidth < 768
        const paramsActuales = `${tipoPrenda}-${colorRemera}`

        // 1. Carga paralela de recursos
        const cargarRecursos = async () => {
            let remeraFinal = null

            // Remera (Cache o Carga)
            if (refRemeraFinalCache.current[v]?.params === paramsActuales) {
                remeraFinal = refRemeraFinalCache.current[v].canvas
            } else {
                const urlRemera = obtenerUrlRemeraBase(v)
                const imgRemera = await new Promise((resolve, reject) => {
                    const cache = refCacheImagenes.current[urlRemera]; if (cache) return resolve(cache)
                    const img = new Image(); img.crossOrigin = 'anonymous'
                    img.onload = () => { refCacheImagenes.current[urlRemera] = img; resolve(img) }
                    img.onerror = reject; img.src = urlRemera
                }).catch(() => null)

                if (imgRemera) {
                    const sinFondo = eliminarFondo(imgRemera, colorRemera)
                    remeraFinal = (colorRemera !== '#FFFFFF') ? tenirRemera(sinFondo, colorRemera) : sinFondo
                    refRemeraFinalCache.current[v] = { canvas: remeraFinal, params: paramsActuales }
                }
            }

            // Icono
            const imgIcono = diseno.icono ? await new Promise((resolve, reject) => {
                const url = diseno.icono.src
                if (refCacheImagenes.current[url]) return resolve(refCacheImagenes.current[url])
                const img = new Image(); img.crossOrigin = 'anonymous'
                img.onload = () => { refCacheImagenes.current[url] = img; resolve(img) }
                img.onerror = reject; img.src = url
            }).catch(() => null) : null

            return { remeraFinal, imgIcono }
        }

        const recursos = await cargarRecursos()

        // VALIDACIÓN: Si esta versión de renderizado ya es vieja, cancelar
        if (refVersionRender.current[v] !== versionActual) return

        // 2. Dibujo Final
        if (recursos.remeraFinal) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = esMobile ? 'low' : 'high'

            const { remeraFinal, imgIcono } = recursos
            const relacionAspecto = remeraFinal.width / remeraFinal.height
            // Factor de escala dinámico: la espalda de la musculosa es más pequeña en la imagen base, la compensamos
            const factorEscala = tipoPrenda === 'musculosa'
                ? (v === 'back' ? 1.35 : 1.25)
                : 0.95
            let sW = canvas.width * factorEscala, sH = sW / relacionAspecto
            if (sH > canvas.height * factorEscala) { sH = canvas.height * factorEscala; sW = sH * relacionAspecto }
            const sX = (canvas.width - sW) / 2
            const sY = (canvas.height - sH) / 2

            if (!esMobile) {
                ctx.save();

                // Quitamos todas las sombras suaves del contexto para que no brille
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;

                // Contorno blanco sólido "seco" de 2px (estilo sticker puro, sin transparencia ni glow)
                canvas.style.filter = `
                    drop-shadow(2px 2px 0px #FFFFFF) 
                    drop-shadow(-2px -2px 0px #FFFFFF) 
                    drop-shadow(2px -2px 0px #FFFFFF) 
                    drop-shadow(-2px 2px 0px #FFFFFF)
                `;

                ctx.drawImage(remeraFinal, sX, sY, sW, sH);
                ctx.restore()
            } else {
                // En móvil también eliminamos el brillo
                canvas.style.filter = 'drop-shadow(1px 1px 0px white) drop-shadow(-1px -1px 0px white) drop-shadow(1px -1px 0px white) drop-shadow(-1px 1px 0px white)'
                ctx.drawImage(remeraFinal, sX, sY, sW, sH)
            }

            if (imgIcono) {
                ctx.save()
                if (!esMobile) { ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3 }
                ctx.drawImage(imgIcono, diseno.posicion.x - diseno.tamanio / 2, diseno.posicion.y - diseno.tamanio / 2, diseno.tamanio, diseno.tamanio)
                ctx.restore()

                if (forzarMostrarSeleccion && v === vista) {
                    ctx.strokeStyle = '#667eea'; ctx.lineWidth = 2; ctx.setLineDash([5, 5])
                    ctx.strokeRect(diseno.posicion.x - diseno.tamanio / 2, diseno.posicion.y - diseno.tamanio / 2, diseno.tamanio, diseno.tamanio)
                    ctx.setLineDash([])
                }
            }

            // Texto informativo de la vista (FRENTE / ESPALDA)
            ctx.fillStyle = '#0a0a0a';
            ctx.font = 'bold 15px sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'transparent'; // Eliminamos brillo/sombra
            ctx.shadowBlur = 0;
            ctx.fillText(v === 'front' ? 'FRENTE' : 'ESPALDA', canvas.width / 2, canvas.height - 15)
        }
    }, [colorRemera, vista, tipoPrenda])

    // Efecto para renderizar ambos lados y mantener consistencia
    useEffect(() => {
        const mostrarF = estaEnVistaPrevia ? false : (vista === 'front' ? mostrarSeleccion : false)
        const mostrarB = estaEnVistaPrevia ? false : (vista === 'back' ? mostrarSeleccion : false)

        renderizarCara(refCanvasFront.current, 'front', estampas.front, mostrarF)
        renderizarCara(refCanvasBack.current, 'back', estampas.back, mostrarB)
    }, [renderizarCara, estampas, mostrarSeleccion, vista, estaEnVistaPrevia])

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
            <div className={`tarjeta-remera ${vista === 'back' ? 'girada' : ''} ${estaEnVistaPrevia ? 'modo-preview' : ''}`}>
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

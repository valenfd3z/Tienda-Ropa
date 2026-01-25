/*
 * Lienzo de la Prenda - Componente de renderizado avanzado basado en Canvas
 * Gestiona: procesamiento de imágenes (tinte/fondo), drag & drop y composición visual.
 */
import { useEffect, useRef, useState, useCallback } from 'react'
import { eliminarFondo, tenirRemera } from '../utils/procesamientoImagen'
import { VISTA_FRONTAL, VISTA_TRASERA, TIPO_MUSCULOSA } from '../constants'
import './LienzoRemera.css'

const LienzoRemera = ({
    colorRemera,
    vista,
    tipoPrenda,
    urlImagenRemeraPersonalizada, // Futura expansión para subida de usuario
    estampas,
    mostrarSeleccion,
    estaEnVistaPrevia,
    talle,
    alPrepararLienzo,
    alCambiarPosicionIcono
}) => {
    // Referencias a los lienzos físicos (Frente y Espalda)
    const referenciaLienzoFrontal = useRef(null)
    const referenciaLienzoTrasero = useRef(null)
    const referenciaContenedor = useRef(null)

    // Estados de interacción
    const [estaArrastrando, setEstaArrastrando] = useState(false)
    const [desfaseArrastre, setDesfaseArrastre] = useState({ x: 0, y: 0 })

    // Caché persistente para optimizar el rendimiento del renderizado
    const cacheImagenesRaw = useRef({})
    const cachePrendasRenderizadas = useRef({ [VISTA_FRONTAL]: null, [VISTA_TRASERA]: null, fingerprint: '' })

    // Control de concurrencia para evitar parpadeos en renderizados asíncronos rápidos
    const referenciaVersionRender = useRef({ [VISTA_FRONTAL]: 0, [VISTA_TRASERA]: 0 })

    // Referencia al estado actual para ser accedido desde Listeners (evita stale closures)
    const referenciaEstado = useRef({
        estampas,
        vista,
        alCambiarPosicionIcono
    })

    useEffect(() => {
        referenciaEstado.current = { estampas, vista, alCambiarPosicionIcono }
    }, [estampas, vista, alCambiarPosicionIcono])

    /**
     * Gestión unificada de eventos táctiles para dispositivos móviles
     */
    useEffect(() => {
        const gestionarToque = (evento, refLienzo) => {
            const lienzo = refLienzo.current
            const vistaLienzo = refLienzo === referenciaLienzoFrontal ? VISTA_FRONTAL : VISTA_TRASERA

            if (!lienzo || referenciaEstado.current.vista !== vistaLienzo) return

            const { estampas, vista: vistaActual } = referenciaEstado.current
            const estampaActual = estampas[vistaActual]
            if (!estampaActual.icono) return

            const rectangulo = lienzo.getBoundingClientRect()
            const toque = evento.touches[0]
            const x = (toque.clientX - rectangulo.left) * (lienzo.width / rectangulo.width)
            const y = (toque.clientY - rectangulo.top) * (lienzo.height / rectangulo.height)

            if (evento.type === 'touchstart') {
                const enRangoX = x >= estampaActual.posicion.x - estampaActual.tamanio / 2 && x <= estampaActual.posicion.x + estampaActual.tamanio / 2
                const enRangoY = y >= estampaActual.posicion.y - estampaActual.tamanio / 2 && y <= estampaActual.posicion.y + estampaActual.tamanio / 2

                if (enRangoX && enRangoY) {
                    evento.preventDefault()
                    setEstaArrastrando(true)
                    setDesfaseArrastre({ x: x - estampaActual.posicion.x, y: y - estampaActual.posicion.y })
                }
            } else if (evento.type === 'touchmove' && estaArrastrando) {
                evento.preventDefault()
                const { alCambiarPosicionIcono: callbackPos } = referenciaEstado.current
                callbackPos({
                    x: Math.max(estampaActual.tamanio / 2, Math.min(lienzo.width - estampaActual.tamanio / 2, x - desfaseArrastre.x)),
                    y: Math.max(estampaActual.tamanio / 2, Math.min(lienzo.height - estampaActual.tamanio / 2, y - desfaseArrastre.y))
                })
            }
        }

        const canvasF = referenciaLienzoFrontal.current
        const canvasT = referenciaLienzoTrasero.current

        const inicioF = (e) => gestionarToque(e, referenciaLienzoFrontal)
        const moverF = (e) => gestionarToque(e, referenciaLienzoFrontal)
        const inicioT = (e) => gestionarToque(e, referenciaLienzoTrasero)
        const moverT = (e) => gestionarToque(e, referenciaLienzoTrasero)
        const finArrastre = () => setEstaArrastrando(false)

        canvasF?.addEventListener('touchstart', inicioF, { passive: false })
        canvasF?.addEventListener('touchmove', moverF, { passive: false })
        canvasT?.addEventListener('touchstart', inicioT, { passive: false })
        canvasT?.addEventListener('touchmove', moverT, { passive: false })
        window.addEventListener('touchend', finArrastre)

        return () => {
            canvasF?.removeEventListener('touchstart', inicioF)
            canvasF?.removeEventListener('touchmove', moverF)
            canvasT?.removeEventListener('touchstart', inicioT)
            canvasT?.removeEventListener('touchmove', moverT)
            window.removeEventListener('touchend', finArrastre)
        }
    }, [estaArrastrando, desfaseArrastre])

    // Notificar al componente padre que el lienzo está listo
    useEffect(() => {
        if (referenciaLienzoFrontal.current) alPrepararLienzo(referenciaLienzoFrontal.current)
    }, [alPrepararLienzo])

    /**
     * Motor de Renderizado Principal
     * Compone la prenda, aplica tintes y añade el estampado con sombras dinámicas.
     */
    const renderizarCara = useCallback(async (lienzo, lado, diseno, forzarMostrarSeleccion) => {
        if (!lienzo) return

        const versionActual = ++referenciaVersionRender.current[lado]
        const contexto = lienzo.getContext('2d')
        const esMovil = window.innerWidth < 768
        const huellaPrenda = `${tipoPrenda}-${colorRemera}`

        // Función interna para obtener la URL base (blanca) de la prenda
        const obtenerUrlBase = (vistaLado) => `/assets/tshirts/${tipoPrenda}-${vistaLado}-white.png`

        const cargarActivos = async () => {
            let imagenPrenda = null

            // 1. Obtención de la prenda (desde caché o carga nueva)
            if (cachePrendasRenderizadas.current[lado]?.fingerprint === huellaPrenda) {
                imagenPrenda = cachePrendasRenderizadas.current[lado].canvas
            } else {
                const url = obtenerUrlBase(lado)
                const imgOriginal = await new Promise((resolve, reject) => {
                    const cache = cacheImagenesRaw.current[url];
                    if (cache) return resolve(cache)
                    const img = new Image();
                    img.crossOrigin = 'anonymous'
                    img.onload = () => { cacheImagenesRaw.current[url] = img; resolve(img) }
                    img.onerror = reject; img.src = url
                }).catch(() => null)

                if (imgOriginal) {
                    const sinFondo = eliminarFondo(imgOriginal, colorRemera)
                    imagenPrenda = (colorRemera !== '#FFFFFF') ? tenirRemera(sinFondo, colorRemera) : sinFondo
                    cachePrendasRenderizadas.current[lado] = { canvas: imagenPrenda, fingerprint: huellaPrenda }
                }
            }

            // 2. Obtención del estampado
            const imagenEstampado = diseno.icono ? await new Promise((resolve, reject) => {
                const src = diseno.icono.src
                if (cacheImagenesRaw.current[src]) return resolve(cacheImagenesRaw.current[src])
                const img = new Image();
                img.crossOrigin = 'anonymous'
                img.onload = () => { cacheImagenesRaw.current[src] = img; resolve(img) }
                img.onerror = reject; img.src = src
            }).catch(() => null) : null

            return { imagenPrenda, imagenEstampado }
        }

        const recursos = await cargarActivos()

        // Si se inició un renderizado más nuevo durante la espera asíncrona, abortamos este
        if (referenciaVersionRender.current[lado] !== versionActual) return

        // Dibujo de la composición final
        if (recursos.imagenPrenda) {
            contexto.clearRect(0, 0, lienzo.width, lienzo.height)
            contexto.imageSmoothingEnabled = true
            contexto.imageSmoothingQuality = esMovil ? 'medium' : 'high'

            const { imagenPrenda: prenda, imagenEstampado: estampa } = recursos
            const ratio = prenda.width / prenda.height

            // Compensación de escala según tipo de prenda
            const escalaRef = tipoPrenda === TIPO_MUSCULOSA ? (lado === VISTA_TRASERA ? 1.35 : 1.25) : 0.95
            let ancho = lienzo.width * escalaRef
            let alto = ancho / ratio

            if (alto > lienzo.height * escalaRef) {
                alto = lienzo.height * escalaRef;
                ancho = alto * ratio
            }

            const x = (lienzo.width - ancho) / 2
            const y = (lienzo.height - alto) / 2

            // Aplicar contorno tipo sticker mediante filtro CSS (más fino y realista)
            const intensidadSombra = esMovil ? '0.5px' : '1px'
            lienzo.style.filter = `drop-shadow(${intensidadSombra} ${intensidadSombra} 0 rgba(255,255,255,0.8)) drop-shadow(-${intensidadSombra} -${intensidadSombra} 0 rgba(255,255,255,0.8)) drop-shadow(${intensidadSombra} -${intensidadSombra} 0 rgba(255,255,255,0.8)) drop-shadow(-${intensidadSombra} ${intensidadSombra} 0 rgba(255,255,255,0.8))`

            contexto.drawImage(prenda, x, y, ancho, alto)

            if (estampa) {
                contexto.save()
                if (!esMovil) {
                    contexto.shadowColor = 'rgba(0,0,0,0.25)';
                    contexto.shadowBlur = 6;
                    contexto.shadowOffsetY = 2
                }
                contexto.drawImage(
                    estampa,
                    diseno.posicion.x - diseno.tamanio / 2,
                    diseno.posicion.y - diseno.tamanio / 2,
                    diseno.tamanio,
                    diseno.tamanio
                )
                contexto.restore()

                // Dibujar marco de selección interactivo
                if (forzarMostrarSeleccion && lado === vista) {
                    contexto.strokeStyle = 'var(--primary-color)';
                    contexto.lineWidth = 2;
                    contexto.setLineDash([5, 5])
                    contexto.strokeRect(
                        diseno.posicion.x - diseno.tamanio / 2,
                        diseno.posicion.y - diseno.tamanio / 2,
                        diseno.tamanio,
                        diseno.tamanio
                    )
                    contexto.setLineDash([])
                }
            }

            // Etiqueta de la vista actual
            contexto.fillStyle = 'var(--text-primary)';
            contexto.font = 'bold 15px sans-serif';
            contexto.textAlign = 'center';
            contexto.fillText(lado === VISTA_FRONTAL ? 'FRENTE' : 'ESPALDA', lienzo.width / 2, lienzo.height - 15)
        }
    }, [colorRemera, vista, tipoPrenda])

    // Sincronización del bucle de renderizado
    useEffect(() => {
        const mostrarF = estaEnVistaPrevia ? false : (vista === VISTA_FRONTAL ? mostrarSeleccion : false)
        const mostrarT = estaEnVistaPrevia ? false : (vista === VISTA_TRASERA ? mostrarSeleccion : false)

        renderizarCara(referenciaLienzoFrontal.current, VISTA_FRONTAL, estampas[VISTA_FRONTAL], mostrarF)
        renderizarCara(referenciaLienzoTrasero.current, VISTA_TRASERA, estampas[VISTA_TRASERA], mostrarT)
    }, [renderizarCara, estampas, mostrarSeleccion, vista, estaEnVistaPrevia])

    const manejarMouseDown = (lado, e, refLienzo) => {
        if (lado !== vista) return
        const lienzo = refLienzo.current
        const estampaActual = estampas[lado]
        if (!estampaActual.icono) return

        const rect = lienzo.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (lienzo.width / rect.width)
        const y = (e.clientY - rect.top) * (lienzo.height / rect.height)

        if (x >= estampaActual.posicion.x - estampaActual.tamanio / 2 && x <= estampaActual.posicion.x + estampaActual.tamanio / 2 &&
            y >= estampaActual.posicion.y - estampaActual.tamanio / 2 && y <= estampaActual.posicion.y + estampaActual.tamanio / 2) {
            setEstaArrastrando(true)
            setDesfaseArrastre({ x: x - estampaActual.posicion.x, y: y - estampaActual.posicion.y })
        }
    }

    const manejarMouseMove = (lado, e, refLienzo) => {
        if (!estaArrastrando || lado !== vista) return
        const lienzo = refLienzo.current
        const estampaActual = estampas[lado]
        const rect = lienzo.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (lienzo.width / rect.width)
        const y = (e.clientY - rect.top) * (lienzo.height / rect.height)

        alCambiarPosicionIcono({
            x: Math.max(estampaActual.tamanio / 2, Math.min(lienzo.width - estampaActual.tamanio / 2, x - desfaseArrastre.x)),
            y: Math.max(estampaActual.tamanio / 2, Math.min(lienzo.height - estampaActual.tamanio / 2, y - desfaseArrastre.y))
        })
    }

    return (
        <div className="contenedor-lienzo-remera" ref={referenciaContenedor}>
            <div className="instrucciones-lienzo">
                <p>💡 <strong>Arrastrá el diseño</strong> para posicionarlo.</p>
            </div>
            <div className={`tarjeta-remera ${vista === VISTA_TRASERA ? 'girada' : ''} ${estaEnVistaPrevia ? 'modo-preview' : ''}`}>
                <div className="tarjeta-remera-interna">
                    <div className="cara-remera cara-frontal">
                        <canvas
                            ref={referenciaLienzoFrontal}
                            width={600}
                            height={750}
                            className="lienzo-remera"
                            onMouseDown={(e) => manejarMouseDown(VISTA_FRONTAL, e, referenciaLienzoFrontal)}
                            onMouseMove={(e) => manejarMouseMove(VISTA_FRONTAL, e, referenciaLienzoFrontal)}
                            onMouseUp={() => setEstaArrastrando(false)}
                            onMouseLeave={() => setEstaArrastrando(false)}
                            style={{ cursor: vista === VISTA_FRONTAL && estampas[VISTA_FRONTAL].icono ? (estaArrastrando ? 'grabbing' : 'grab') : 'default' }}
                        />
                    </div>
                    <div className="cara-remera cara-trasera">
                        <canvas
                            ref={referenciaLienzoTrasero}
                            width={600}
                            height={750}
                            className="lienzo-remera"
                            onMouseDown={(e) => manejarMouseDown(VISTA_TRASERA, e, referenciaLienzoTrasero)}
                            onMouseMove={(e) => manejarMouseMove(VISTA_TRASERA, e, referenciaLienzoTrasero)}
                            onMouseUp={() => setEstaArrastrando(false)}
                            onMouseLeave={() => setEstaArrastrando(false)}
                            style={{ cursor: vista === VISTA_TRASERA && estampas[VISTA_TRASERA].icono ? (estaArrastrando ? 'grabbing' : 'grab') : 'default' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LienzoRemera

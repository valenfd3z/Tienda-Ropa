/*
 * Utilidades de Procesamiento de Imagen para el simulador de remeras
 */

export const eliminarFondo = (img, colorRemera) => {
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

    let tolerancia = 65
    let suavizado = 8

    // Si detectamos un fondo muy saturado (como el azul chroma), podemos ser más agresivos
    const esFondoChroma = coloresFondo.some(c => (c[2] > c[0] * 1.3 && c[2] > c[1] * 1.3)) // Detecta azul fuerte
    if (esFondoChroma) {
        tolerancia = 85
        suavizado = 15
    }

    for (let i = 0; i < pixeles.length; i += 4) {
        const r = pixeles[i], g = pixeles[i + 1], b = pixeles[i + 2]
        let distMinSq = 1000000
        for (let j = 0; j < coloresFondo.length; j++) {
            const bg = coloresFondo[j]
            const dr = r - bg[0], dg = g - bg[1], db = b - bg[2]
            const dSq = dr * dr + dg * dg + db * db
            if (dSq < distMinSq) distMinSq = dSq
        }
        const distMin = Math.sqrt(distMinSq)
        if (distMin < tolerancia - suavizado) {
            pixeles[i + 3] = 0
        } else if (distMin < tolerancia) {
            // Suavizado corregido para evitar rebordes de color
            const alpha = ((distMin - (tolerancia - suavizado)) / suavizado)
            pixeles[i + 3] = alpha * 255

            // Limpieza de bordes: si el pixel tiene trazas de azul, lo forzamos a blanco base
            if (b > r && b > g) {
                pixeles[i] = 255; pixeles[i + 1] = 255; pixeles[i + 2] = 255
            }
        } else {
            // Incluso en opacos, si hay tinte azul en el borde, limpiamos
            if (esFondoChroma && b > r * 1.1 && b > g * 1.1) {
                pixeles[i] = 255; pixeles[i + 1] = 255; pixeles[i + 2] = 255
            }
        }
    }

    ctxTemp.putImageData(datosImagen, 0, 0)
    return lienzoTemp
}

export const tenirRemera = (remeraProcesada, color) => {
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

    return lienzoTemp
}

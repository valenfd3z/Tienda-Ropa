/*
 * Partículas de Fondo - Efecto visual animado con canvas
 */
import { useEffect, useRef } from 'react'
import './Particulas.css'

const Particulas = () => {
    const refCanvas = useRef(null)

    useEffect(() => {
        const canvas = refCanvas.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        let idAnimacion
        let particulas = []
        const cantidadParticulas = 60

        const ajustarTamanio = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            inicializarParticulas()
        }

        const inicializarParticulas = () => {
            particulas = []
            for (let i = 0; i < cantidadParticulas; i++) {
                particulas.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    tamanio: Math.random() * 2 + 1,
                    velocidadX: (Math.random() - 0.5) * 0.5,
                    velocidadY: (Math.random() - 0.5) * 0.5,
                    opacidad: Math.random() * 0.5 + 0.2
                })
            }
        }

        const animar = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particulas.forEach(p => {
                p.x += p.velocidadX
                p.y += p.velocidadY

                // Efecto wrap-around
                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.tamanio, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacidad})`
                ctx.fill()
            })

            idAnimacion = requestAnimationFrame(animar)
        }

        window.addEventListener('resize', ajustarTamanio)
        ajustarTamanio()
        animar()

        return () => {
            window.removeEventListener('resize', ajustarTamanio)
            cancelAnimationFrame(idAnimacion)
        }
    }, [])

    return <canvas ref={refCanvas} className="lienzo-particulas" />
}

export default Particulas

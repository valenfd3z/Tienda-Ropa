import { useEffect, useRef, useState } from 'react'
import './ShirtCanvas.css'

const ShirtCanvas = ({ shirtColor, view, shirtImageOverrideUrl, selectedIcon, iconPosition, iconSize, showSelection, size, onCanvasReady, onIconPositionChange }) => {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [isTransitioning, setIsTransitioning] = useState(false)

    // Image cache to prevent flickering
    const imagesRef = useRef({})
    // Cache for processed (transparent) shirt images
    const processedShirtsRef = useRef({})

    useEffect(() => {
        if (canvasRef.current) {
            onCanvasReady(canvasRef.current)
        }
    }, [onCanvasReady])

    useEffect(() => {
        setIsTransitioning(true)
        const timer = setTimeout(() => setIsTransitioning(false), 400)
        return () => clearTimeout(timer)
    }, [view, shirtColor])

    const getTshirtImageUrl = (view, color) => {
        const colorMap = {
            '#FFFFFF': 'white',
            '#6B7280': 'darkgray',
            '#000000': 'black',
            '#1E3A8A': 'navy',
            '#DC2626': 'red',
        }
        const colorName = colorMap[color] || 'white'
        return `/assets/tshirts/tshirt-${view}-${colorName}.png`
    }

    const getBaseTshirtImageUrl = (view) => {
        return `/assets/tshirts/tshirt-${view}-white.png`
    }

    const isColorDark = (color) => {
        const darkColors = ['#6B7280', '#000000', '#1E3A8A', '#DC2626', '#16A34A', '#7C3AED', '#EC4899', '#F97316']
        return darkColors.includes(color)
    }

    // EXTREME QUALITY: High-fidelity background removal with edge matting
    const removeBackground = (img) => {
        const cacheKey = img.src + shirtColor
        if (processedShirtsRef.current[cacheKey]) return processedShirtsRef.current[cacheKey]

        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = img.width
        tempCanvas.height = img.height
        tempCtx.drawImage(img, 0, 0)

        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
        const data = imageData.data
        const width = tempCanvas.width
        const height = tempCanvas.height

        // 1. Robust Background Sampling (Sample entire border)
        const getPixel = (x, y) => {
            const i = (y * width + x) * 4
            return [data[i], data[i + 1], data[i + 2]]
        }

        const samples = []
        // Sample every 10th pixel along the borders
        for (let x = 0; x < width; x += 10) {
            samples.push(getPixel(x, 0))
            samples.push(getPixel(x, height - 1))
        }
        for (let y = 0; y < height; y += 10) {
            samples.push(getPixel(0, y))
            samples.push(getPixel(width - 1, y))
        }

        const bgR = samples.reduce((a, b) => a + b[0], 0) / samples.length
        const bgG = samples.reduce((a, b) => a + b[1], 0) / samples.length
        const bgB = samples.reduce((a, b) => a + b[2], 0) / samples.length

        // 2. High-Precision Distance Calculation
        let tolerance = 90 // Default higher tolerance to ensure removal
        let feather = 8

        if (shirtColor === '#6B7280') { // Gray
            tolerance = 70
            feather = 12
        } else if (shirtColor === '#000000' || shirtColor === '#1E3A8A') { // Black/Navy
            tolerance = 80
            feather = 10
        } else if (shirtColor === '#DC2626') { // Red
            tolerance = 92
            feather = 8
        }

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2]
            const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2))

            if (dist < tolerance - feather) {
                data[i + 3] = 0
            } else if (dist < tolerance) {
                // Smooth transition
                const ratio = (dist - (tolerance - feather)) / feather
                data[i + 3] = ratio * 255
            }
        }

        // 3. Advanced Edge Matting Pass
        const originalAlpha = new Uint8Array(data.length / 4)
        for (let i = 0; i < data.length; i += 4) originalAlpha[i / 4] = data[i + 3]

        for (let y = 2; y < height - 2; y++) {
            for (let x = 2; x < width - 2; x++) {
                const i = (y * width + x) * 4
                if (data[i + 3] > 0) {
                    // 5x5 Kernel for ultra-smooth edges
                    let sumAlpha = 0
                    let count = 0
                    for (let ny = -2; ny <= 2; ny++) {
                        for (let nx = -2; nx <= 2; nx++) {
                            sumAlpha += originalAlpha[(y + ny) * width + (x + nx)]
                            count++
                        }
                    }
                    const avgAlpha = sumAlpha / count

                    // Only smooth if we are near an edge to preserve center detail
                    if (avgAlpha < 250) {
                        data[i + 3] = (data[i + 3] * 0.2) + (avgAlpha * 0.8)
                    }
                }
            }
        }

        // 4. Rim Light Effect (Subtle inner glow to help the shirt pop)
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const i = (y * width + x) * 4
                if (data[i + 3] > 200) {
                    // Check if neighbor is transparent
                    const isNearEdge =
                        originalAlpha[(y - 1) * width + x] < 200 ||
                        originalAlpha[(y + 1) * width + x] < 200 ||
                        originalAlpha[y * width + (x - 1)] < 200 ||
                        originalAlpha[y * width + (x + 1)] < 200

                    if (isNearEdge) {
                        // Lighten the edge slightly
                        const factor = 1.03
                        data[i] = Math.min(255, data[i] * factor)
                        data[i + 1] = Math.min(255, data[i + 1] * factor)
                        data[i + 2] = Math.min(255, data[i + 2] * factor)
                    }
                }
            }
        }

        tempCtx.putImageData(imageData, 0, 0)
        processedShirtsRef.current[cacheKey] = tempCanvas
        return tempCanvas
    }

    const tintShirt = (processedShirt, color) => {
        const cacheKey = `tint|${color}|${processedShirt.width}x${processedShirt.height}|${processedShirt.__src || ''}`
        if (processedShirtsRef.current[cacheKey]) return processedShirtsRef.current[cacheKey]

        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = processedShirt.width
        tempCanvas.height = processedShirt.height

        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
        tempCtx.globalCompositeOperation = 'source-over'
        tempCtx.drawImage(processedShirt, 0, 0)
        tempCtx.globalCompositeOperation = 'multiply'
        tempCtx.fillStyle = color
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
        tempCtx.globalCompositeOperation = 'destination-in'
        tempCtx.drawImage(processedShirt, 0, 0)
        tempCtx.globalCompositeOperation = 'source-over'

        processedShirtsRef.current[cacheKey] = tempCanvas
        return tempCanvas
    }

    const render = (showSelection = true) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const shirtUrl = shirtImageOverrideUrl || getBaseTshirtImageUrl(view)
        const bgUrl = '/assets/background.png'

        const drawAll = (bgImg, shirtImg, iconImg) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Maximum quality smoothing
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'

            // 1. Draw Background
            if (bgImg) {
                const bgAspect = bgImg.width / bgImg.height
                const canvasAspect = canvas.width / canvas.height
                let bgW, bgH, bgX, bgY
                if (bgAspect > canvasAspect) {
                    bgH = canvas.height
                    bgW = bgH * bgAspect
                    bgX = (canvas.width - bgW) / 2
                    bgY = 0
                } else {
                    bgW = canvas.width
                    bgH = bgW / bgAspect
                    bgX = 0
                    bgY = (canvas.height - bgH) / 2
                }
                ctx.drawImage(bgImg, bgX, bgY, bgW, bgH)
            }

            // 2. Draw Shirt (Processed)
            if (shirtImg) {
                const processedShirt = removeBackground(shirtImg)
                if (!processedShirt.__src) processedShirt.__src = shirtImg.src

                const finalShirt = (shirtColor !== '#FFFFFF') ? tintShirt(processedShirt, shirtColor) : processedShirt
                const shirtAspect = finalShirt.width / finalShirt.height
                let sW, sH, sX, sY

                const scale = 0.92
                sW = canvas.width * scale
                sH = sW / shirtAspect

                if (sH > canvas.height * 0.92) {
                    sH = canvas.height * 0.92
                    sW = sH * shirtAspect
                }

                sX = (canvas.width - sW) / 2
                sY = (canvas.height - sH) / 2

                // Subtle white outline ONLY for black shirts to improve separation from the background
                if (shirtColor === '#000000') {
                    ctx.save()
                    ctx.shadowColor = 'rgba(255,255,255,0.85)'
                    ctx.shadowBlur = 4
                    ctx.shadowOffsetX = 0
                    ctx.shadowOffsetY = 0
                    ctx.drawImage(finalShirt, sX, sY, sW, sH)
                    ctx.restore()
                }

                // Draw with a very sharp but deep shadow for professional look
                ctx.save()
                ctx.shadowColor = 'rgba(0,0,0,0.6)'
                ctx.shadowBlur = 3
                ctx.shadowOffsetY = 2
                ctx.drawImage(finalShirt, sX, sY, sW, sH)
                ctx.restore()

                // Main pass
                ctx.drawImage(finalShirt, sX, sY, sW, sH)
            }

            // 3. Draw Icon
            if (iconImg && selectedIcon) {
                ctx.save()
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
                ctx.shadowBlur = 10
                ctx.shadowOffsetY = 3

                // Apply filters ONLY if it is a preset icon (monochrome SVG)
                // User uploaded images should keep their original colors
                if (selectedIcon.isPreset) {
                    if (isColorDark(shirtColor)) {
                        ctx.filter = 'invert(1) brightness(1.1)'
                    } else {
                        ctx.filter = 'brightness(0.2)'
                    }
                }

                ctx.drawImage(iconImg, iconPosition.x - iconSize / 2, iconPosition.y - iconSize / 2, iconSize, iconSize)
                ctx.restore()

                if (showSelection) {
                    ctx.strokeStyle = 'rgba(102, 126, 234, 0.8)'
                    ctx.lineWidth = 2
                    ctx.setLineDash([5, 5])
                    ctx.strokeRect(iconPosition.x - iconSize / 2, iconPosition.y - iconSize / 2, iconSize, iconSize)
                    ctx.setLineDash([])
                }
            }

            // 4. Labels
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.font = 'bold 14px sans-serif'
            ctx.textAlign = 'center'
            const viewLabel = view === 'front' ? 'FRENTE' : 'ESPALDA'
            ctx.fillText(viewLabel, canvas.width / 2, canvas.height - 15)

            ctx.textAlign = 'left'
            ctx.font = 'bold 18px sans-serif'
            ctx.fillText(`TALLE: ${size}`, 20, 35)
        }

        const loadImg = (url) => {
            if (imagesRef.current[url]) return Promise.resolve(imagesRef.current[url])
            return new Promise((resolve) => {
                const img = new Image()
                img.crossOrigin = 'anonymous'
                img.onload = () => {
                    imagesRef.current[url] = img
                    resolve(img)
                }
                img.src = url
            })
        }

        Promise.all([
            loadImg(bgUrl),
            loadImg(shirtUrl),
            selectedIcon ? loadImg(selectedIcon.src) : Promise.resolve(null)
        ]).then(([bgImg, shirtImg, iconImg]) => {
            drawAll(bgImg, shirtImg, iconImg)
        })
    }

    useEffect(() => {
        render(showSelection)
    }, [shirtColor, view, selectedIcon, iconPosition, iconSize, showSelection, size])

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.renderWithoutSelection = () => render(false)
        }
    }, [shirtColor, view, selectedIcon, iconPosition, iconSize, showSelection, size])

    const handleMouseDown = (e) => {
        if (!selectedIcon) return
        const rect = canvasRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width)
        const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height)
        if (x >= iconPosition.x - iconSize / 2 && x <= iconPosition.x + iconSize / 2 &&
            y >= iconPosition.y - iconSize / 2 && y <= iconPosition.y + iconSize / 2) {
            setIsDragging(true)
            setDragOffset({ x: x - iconPosition.x, y: y - iconPosition.y })
        }
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return
        const rect = canvasRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width)
        const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height)
        onIconPositionChange({
            x: Math.max(iconSize / 2, Math.min(canvasRef.current.width - iconSize / 2, x - dragOffset.x)),
            y: Math.max(iconSize / 2, Math.min(canvasRef.current.height - iconSize / 2, y - dragOffset.y))
        })
    }

    const handleTouchStart = (e) => {
        if (!selectedIcon) return
        e.preventDefault()
        const rect = canvasRef.current.getBoundingClientRect()
        const touch = e.touches[0]
        const x = (touch.clientX - rect.left) * (canvasRef.current.width / rect.width)
        const y = (touch.clientY - rect.top) * (canvasRef.current.height / rect.height)
        if (x >= iconPosition.x - iconSize / 2 && x <= iconPosition.x + iconSize / 2 &&
            y >= iconPosition.y - iconSize / 2 && y <= iconPosition.y + iconSize / 2) {
            setIsDragging(true)
            setDragOffset({ x: x - iconPosition.x, y: y - iconPosition.y })
        }
    }

    const handleTouchMove = (e) => {
        if (!isDragging) return
        e.preventDefault()
        const rect = canvasRef.current.getBoundingClientRect()
        const touch = e.touches[0]
        const x = (touch.clientX - rect.left) * (canvasRef.current.width / rect.width)
        const y = (touch.clientY - rect.top) * (canvasRef.current.height / rect.height)
        onIconPositionChange({
            x: Math.max(iconSize / 2, Math.min(canvasRef.current.width - iconSize / 2, x - dragOffset.x)),
            y: Math.max(iconSize / 2, Math.min(canvasRef.current.height - iconSize / 2, y - dragOffset.y))
        })
    }

    return (
        <div className="shirt-canvas-container" ref={containerRef}>
            <canvas
                ref={canvasRef}
                width={400}
                height={500}
                className={`shirt-canvas ${isTransitioning ? 'transitioning' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => setIsDragging(false)}
                style={{ cursor: isDragging ? 'grabbing' : (selectedIcon ? 'grab' : 'default'), touchAction: 'none' }}
            />
            <div className="canvas-instructions">
                <p>💡 <strong>Arrastrá el diseño</strong> para posicionarlo.</p>
            </div>
        </div>
    )
}

export default ShirtCanvas

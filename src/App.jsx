import { useState, useRef } from 'react'
import './App.css'
import ShirtCanvas from './components/ShirtCanvas'
import ColorPicker from './components/ColorPicker'
import SizeSelector from './components/SizeSelector'
import ViewToggle from './components/ViewToggle'
import IconPicker from './components/IconPicker'
import IconControls from './components/IconControls'
import ExportButton from './components/ExportButton'
import ContactButton from './components/ContactButton'
import Particles from './components/Particles'
import HowToUse from './components/HowToUse'
import Footer from './components/Footer'

function App() {
    const [shirtColor, setShirtColor] = useState('#FFFFFF')
    const [size, setSize] = useState('M')
    const [view, setView] = useState('front')
    const [selectedIcon, setSelectedIcon] = useState(null)
    const [iconPosition, setIconPosition] = useState({ x: 200, y: 250 })
    const [iconSize, setIconSize] = useState(100)
    const [canvasRef, setCanvasRef] = useState(null)
    const [showSelection, setShowSelection] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)



    const getColorName = (color) => {
        const colorMap = {
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
        return colorMap[color] || 'white'
    }

    const currentShirtKey = `${view}-${getColorName(shirtColor)}`



    return (
        <div className="app">
            <Particles />
            <header className="app-header">
                <div className="header-top">
                    <h1>👕 NAZARENO CUSTOMS</h1>
                    <button className="help-button" onClick={() => setIsModalOpen(true)}>
                        ❓ CÓMO USAR
                    </button>
                </div>
                <p>Simulador de remeras estampadas premium</p>
            </header>

            <HowToUse isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <section className="intro-section">
                <div className="intro-content">
                    <h2>🧢 ¡Hola! Soy Nazareno</h2>
                    <p>Tu diseñador de confianza para <strong>remeras estampadas personalizadas</strong>.</p>
                    <p>Si estás pensando en crear algo único, podés escribirme directamente. Si ya tenés una idea en mente, usá este simulador para darle vida y mostramelo.</p>
                    <p>Cualquier consulta, no dudes en contactarme por WhatsApp o Instagram. <strong>¡Hagamos que tu estilo destaque!</strong></p>
                </div>
            </section>

            <div className="app-container">
                <div className="canvas-section">
                    <ShirtCanvas
                        shirtColor={shirtColor}
                        view={view}
                        shirtImageOverrideUrl={null}
                        selectedIcon={selectedIcon}
                        iconPosition={iconPosition}
                        iconSize={iconSize}
                        showSelection={showSelection}
                        size={size}
                        onCanvasReady={setCanvasRef}
                        onIconPositionChange={setIconPosition}
                    />
                </div>

                <div className="controls-section">
                    <div className="control-group">
                        <h3>Vista</h3>
                        <ViewToggle view={view} onViewChange={setView} />
                    </div>

                    <div className="control-group">
                        <h3>Color de la Remera</h3>
                        <ColorPicker selectedColor={shirtColor} onColorChange={setShirtColor} />
                    </div>



                    <div className="control-group">
                        <h3>Talle</h3>
                        <SizeSelector selectedSize={size} onSizeChange={setSize} />
                    </div>

                    <div className="control-group">
                        <h3>Elegí tu Diseño</h3>
                        <IconPicker selectedIcon={selectedIcon} onIconChange={setSelectedIcon} />
                    </div>

                    {selectedIcon && (
                        <div className="control-group">
                            <h3>Ajustar Diseño</h3>
                            <IconControls
                                iconSize={iconSize}
                                onIconSizeChange={setIconSize}
                                showSelection={showSelection}
                                onToggleSelection={() => setShowSelection(!showSelection)}
                                onResetPosition={() => setIconPosition({ x: 200, y: 250 })}
                            />
                        </div>
                    )}

                    <div className="action-buttons">
                        <ExportButton canvasRef={canvasRef} />
                        <ContactButton size={size} shirtColor={shirtColor} view={view} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default App

# 🎨 Diseñador de Remeras Personalizado

Web app estática para diseñar remeras personalizadas con **fotografías reales**, optimizada para Instagram.

## 🚀 Características

- ✅ **Fotos reales de remeras** con sistema de mockup profesional
- ✅ 16 colores profesionales con overlay realista
- ✅ 6 íconos modernos minimalistas (SVG)
- ✅ Selector de talle (S, M, L, XL)
- ✅ Vista Frente/Espalda
- ✅ Subir diseño propio (PNG/SVG, máx 2MB)
- ✅ 9 posiciones predefinidas para diseños
- ✅ Vista previa en tiempo real con HTML5 Canvas
- ✅ Exportar diseño como PNG de alta calidad
- ✅ Contacto directo por WhatsApp
- ✅ Diseño mobile-first responsive

## 📱 Tecnologías

- React 18
- Vite
- HTML5 Canvas con blend modes
- CSS puro (sin frameworks)
- 100% cliente (sin backend)

## 🛠️ Instalación

```bash
npm install
```

## 📸 IMPORTANTE: Agregar Fotos de Remeras

Para usar **fotos reales de tus remeras**, seguí estos pasos:

### 1. Preparar las Fotos

Necesitás fotos de remeras **BLANCAS** sobre fondo neutro:
- **Formato:** PNG (preferible) o JPG
- **Resolución:** Mínimo 800x1000px (recomendado 1200x1500px)
- **Fondo:** Blanco o transparente
- **Remera:** Blanca (el color se aplica por código)
- **Vistas:** Frente y espalda

**Ejemplo de fotos necesarias:**
- `tshirt-front-white.png` - Remera blanca vista frontal
- `tshirt-back-white.png` - Remera blanca vista trasera

### 2. Colocar las Fotos

Guardá las fotos en la carpeta:
```
public/assets/tshirts/
```

Estructura esperada:
```
public/
  └── assets/
      └── tshirts/
          ├── tshirt-front-white.png
          └── tshirt-back-white.png
```

### 3. Actualizar el Código

Editá `src/components/ShirtCanvas.jsx` línea ~77:

```javascript
const getTshirtImageUrl = (view, color) => {
  // Reemplazá esto:
  return `/assets/tshirts/tshirt-${view}-white.png`
}
```

### 4. Cómo Funciona el Sistema de Color

El sistema usa **blend mode "multiply"** para aplicar color sobre la foto blanca:
1. Carga la foto de remera blanca
2. Aplica el color seleccionado con `multiply`
3. El resultado es una remera del color elegido

**Por eso es CRUCIAL que la foto sea de una remera BLANCA** ✅

### 5. Dónde Conseguir Fotos de Remeras

**Opción A - Tus Propias Fotos:**
- Fotografiá una remera blanca sobre fondo blanco/gris
- Iluminación uniforme
- Vista frontal y trasera centradas

**Opción B - Mockup Templates Gratuitos:**
- [Placeit](https://placeit.net/) - Mockups profesionales
- [Mockup World](https://www.mockupworld.co/) - Templates gratuitos
- [Freepik](https://www.freepik.com/) - Buscar "white t-shirt mockup"

**Opción C - Remover Fondo:**
- Usá [remove.bg](https://www.remove.bg/) para quitar el fondo
- Asegurate que la remera sea blanca

## 🏃 Desarrollo

```bash
npm run dev
```

Abrí http://localhost:5173 en tu navegador.

## 📦 Build para Producción

```bash
npm run build
```

Los archivos estáticos se generan en la carpeta `dist/`.

## 🌐 Deploy

Esta app es 100% estática y puede deployarse en:

- **Netlify**: Arrastrá la carpeta `dist/` o conectá el repo
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Subí la carpeta `dist/`
- **Cualquier hosting estático**

**⚠️ IMPORTANTE:** Asegurate de incluir la carpeta `public/assets/` en el deploy.

## ⚙️ Configuración

### WhatsApp

Editá el número de teléfono en `src/components/ContactButton.jsx`:

```javascript
const phoneNumber = '5491112345678' // Reemplazá con tu número
```

Formato: código de país + código de área + número (sin espacios ni guiones)

### Colores de Remera

Editá el array `colors` en `src/components/ColorPicker.jsx`:

```javascript
const colors = [
  { name: 'Tu Color', value: '#HEXCODE' },
  // Agregar más colores aquí
]
```

### Íconos Predeterminados

Editá el array `defaultIcons` en `src/components/IconPicker.jsx`:

```javascript
const defaultIcons = [
  { 
    id: 7, 
    name: 'Nuevo Ícono',
    svg: 'data:image/svg+xml,...' 
  },
]
```

### Posiciones del Diseño

Modificá la función `getIconPositions` en `src/components/ShirtCanvas.jsx`:

```javascript
const getIconPositions = (canvasWidth, canvasHeight, iconSize) => {
  // Ajustá las coordenadas según tu foto
  const topY = canvasHeight * 0.20 // Ajustar
  // ...
}
```

## 📂 Estructura del Proyecto

```
Tienda/
├── public/
│   └── assets/
│       └── tshirts/           ← COLOCÁ TUS FOTOS AQUÍ
│           ├── tshirt-front-white.png
│           └── tshirt-back-white.png
├── src/
│   ├── components/
│   │   ├── ShirtCanvas.jsx    ← Sistema de mockup
│   │   ├── ColorPicker.jsx    ← 16 colores
│   │   ├── IconPicker.jsx     ← Íconos profesionales
│   │   ├── SizeSelector.jsx
│   │   ├── ViewToggle.jsx
│   │   ├── PositionSelector.jsx
│   │   ├── ExportButton.jsx
│   │   └── ContactButton.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## 🎯 Flujo del Usuario

1. Usuario entra desde Instagram
2. Selecciona color de remera (se aplica sobre la foto real)
3. Elige talle y vista (frente/espalda)
4. Selecciona o sube un diseño
5. Posiciona el diseño en la remera
6. Ve preview realista en tiempo real
7. Descarga PNG del diseño
8. Contacta al vendedor por WhatsApp con la imagen

## 🎨 Sistema de Mockup

### Cómo Funciona

```javascript
// 1. Cargar foto de remera blanca
const tshirtImg = new Image()
tshirtImg.src = '/assets/tshirts/tshirt-front-white.png'

// 2. Dibujar en canvas
ctx.drawImage(tshirtImg, 0, 0, width, height)

// 3. Aplicar color con multiply
ctx.globalCompositeOperation = 'multiply'
ctx.fillStyle = shirtColor // ej: '#EF4444' (rojo)
ctx.fillRect(0, 0, width, height)

// 4. Resultado: remera roja realista
```

### Ventajas de este Sistema

✅ Usa fotos reales de remeras  
✅ Aplica colores de forma realista  
✅ Mantiene texturas y sombras de la foto  
✅ No requiere una foto por cada color  
✅ Exporta PNG de alta calidad  

## 🐛 Troubleshooting

**Las fotos no se cargan:**
- Verificá que estén en `public/assets/tshirts/`
- Verificá los nombres de archivo
- Revisá la consola del navegador (F12)

**Los colores no se ven bien:**
- Asegurate que la foto sea de una remera BLANCA
- Si la remera es de otro color, el multiply no funcionará correctamente

**El diseño no se posiciona bien:**
- Ajustá las coordenadas en `getIconPositions()`
- Cada foto puede necesitar ajustes diferentes

**La imagen exportada se ve mal:**
- Verificá que las fotos sean de alta resolución (min 800x1000px)
- Aumentá el tamaño del canvas si es necesario

## 📝 Notas Técnicas

- **Blend Mode:** Usa `multiply` para aplicar color sobre blanco
- **Canvas Size:** 400x500px (ajustable)
- **Icon Size:** 120px (ajustable según la foto)
- **Supported Formats:** PNG, SVG para diseños
- **Max Upload:** 2MB

## 📄 Licencia

MIT

---

## 🎉 Próximos Pasos

1. ✅ Conseguí fotos de remeras blancas (frente y espalda)
2. ✅ Colocá las fotos en `public/assets/tshirts/`
3. ✅ Actualizá `ShirtCanvas.jsx` con las rutas correctas
4. ✅ Probá la app: `npm run dev`
5. ✅ Ajustá posiciones si es necesario
6. ✅ Configurá tu número de WhatsApp
7. ✅ Build y deploy: `npm run build`

**¡Tu tienda de remeras personalizadas está lista!** 🚀

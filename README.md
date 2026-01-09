# 🎨 Simulador de Remeras Personalizadas - Nazareno Customs

Aplicación web para diseñar remeras personalizadas con **fotografías reales**, optimizada para una experiencia premium y contacto directo vía WhatsApp/Instagram.

## 🚀 Características

- ✅ **Fotos reales de remeras** con sistema de mockup profesional.
- ✅ **11 colores profesionales** con aplicación realista (teñido digital).
- ✅ **6 diseños minimalistas** incluidos (SVG).
- ✅ **Selector de talle** (S, M, L, XL).
- ✅ **Vista Frente/Espalda** con alternancia instantánea.
- ✅ **Subida de diseño propio** (PNG/SVG, máx 2MB).
- ✅ **Posicionamiento libre** (Drag & Drop) y ajuste de tamaño.
- ✅ **Exportación en alta calidad** (PNG) sin bordes de selección.
- ✅ **Contacto directo** pre-llenado para WhatsApp e Instagram.
- ✅ **Diseño responsivo** (Mobile-first).

## 📱 Tecnologías

- **React 18** (Vite)
- **HTML5 Canvas 2D API** (con modos de fusión y procesamiento de bordes)
- **CSS3 Puro** (Variables, Flexbox, Grid y Animaciones)
- **Sin Dependencias Pesadas**: 100% código limpio y eficiente.

## 🛠️ Instalación y Desarrollo

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📸 Guía de Imágenes

El sistema está diseñado para trabajar con fotos reales de remeras blancas.

### 1. Preparación
Necesitás fotos de remeras **BLANCAS** sobre fondo neutro:
- **Formato:** PNG (recomendado) o JPG.
- **Remera:** Debe ser blanca para que el sistema de teñido digital funcione correctamente.
- **Vistas:** Frente (`tshirt-front-white.png`) y Espalda (`tshirt-back-white.png`).

### 2. Ubicación
Colocá tus fotos en:
`public/assets/tshirts/`

## 📂 Estructura del Proyecto (Migración a Español 100%)

El proyecto ha sido migrado íntegramente al español para facilitar su mantenimiento y comprensión.

```
Tienda/
├── public/
│   └── assets/
│       └── tshirts/           ← Colocá aquí tus fotos reales
├── src/
│   ├── components/
│   │   ├── LienzoRemera.jsx   ← Motor de renderizado (Mockup)
│   │   ├── SelectorColor.jsx  ← Selección de 11 colores
│   │   ├── SelectorIcono.jsx  ← Galería de diseños y carga
│   │   ├── SelectorTalle.jsx
│   │   ├── AlternadorVista.jsx
│   │   ├── ControlesIcono.jsx ← Ajuste de tamaño y posición
│   │   ├── BotonExportar.jsx  ← Descarga de PNG
│   │   ├── BotonContacto.jsx  ← WhatsApp e Instagram
│   │   ├── ComoUsar.jsx       ← Modal de ayuda
│   │   ├── Particulas.jsx    ← Efecto visual de fondo
│   │   └── PiePagina.jsx
│   ├── Aplicacion.jsx        ← Componente principal y gestión de estado
│   ├── Aplicacion.css        ← Estilos globales de la aplicación
│   ├── main.jsx              ← Punto de entrada
│   └── index.css             ← Tokens de diseño (Variables CSS)
├── index.html
├── vite.config.js
└── package.json
```

## ⚙️ Configuración Personalizada

### WhatsApp e Instagram
Editá los datos de contacto en `src/components/BotonContacto.jsx`:
- `numeroWhatsApp`: Tu número con código de país (ej: `54911...`).
- `usuarioInstagram`: Tu nombre de usuario (sin la @).

### Colores Disponibles
Podés agregar o quitar colores editando la lista en `src/components/SelectorColor.jsx`.

## 🎨 Motor de Renderizado (Lienzo)

El componente `LienzoRemera.jsx` utiliza técnicas avanzadas de Canvas:
1. **Eliminación de Fondo**: Algoritmo que detecta bordes y limpia el fondo de la foto original.
2. **Teñido Digital**: Utiliza el modo de fusión `multiply` para aplicar color sobre la textura de la remera blanca.
3. **Optimización**: Cache de imágenes y remeras procesadas para un rendimiento fluido.

## 📄 Licencia

Este proyecto es propiedad de **Fiebre Clothing / Nazareno Customs**.

---

**¡Tu simulador de remeras está listo para destacar en redes sociales!** 🚀

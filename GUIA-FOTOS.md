# 📸 Guía: Cómo Agregar Fotos Reales de Remeras

## ¿Por qué necesito fotos de remeras BLANCAS?

El sistema usa un efecto llamado **"multiply blend mode"** que aplica el color seleccionado sobre la foto blanca. Esto permite:

✅ Tener UNA sola foto por vista (frente/espalda)  
✅ Generar TODOS los colores automáticamente  
✅ Mantener las texturas y sombras reales de la foto  

## Paso a Paso

### 1. Conseguir las Fotos

**Opción A - Fotografiar tus propias remeras:**

Necesitás:
- 1 remera blanca
- Fondo blanco o gris claro
- Buena iluminación (natural o con softbox)
- Cámara o smartphone

Tomá 2 fotos:
- Vista frontal (centrada, simétrica)
- Vista trasera (centrada, simétrica)

**Opción B - Descargar mockups gratuitos:**

Sitios recomendados:
- https://www.mockupworld.co (buscar "white t-shirt")
- https://www.freepik.com (buscar "white t-shirt mockup png")
- https://placeit.net (algunos gratuitos)

### 2. Preparar las Fotos

**Requisitos:**
- Formato: PNG (preferible) o JPG
- Resolución: Mínimo 800x1000px, ideal 1200x1500px
- Remera: BLANCA (muy importante)
- Fondo: Blanco, gris claro, o transparente

**Si la foto tiene fondo:**
- Usá https://remove.bg para quitarlo
- Guardá como PNG con transparencia

### 3. Nombrar los Archivos

Renombrá tus fotos:
```
tshirt-front-white.png  (vista frontal)
tshirt-back-white.png   (vista trasera)
```

### 4. Colocar en la Carpeta Correcta

```
Tienda/
  └── public/
      └── assets/
          └── tshirts/
              ├── tshirt-front-white.png  ← Aquí
              └── tshirt-back-white.png   ← Aquí
```

### 5. Actualizar el Código

Abrí `src/components/ShirtCanvas.jsx`

Buscá la función `getTshirtImageUrl` (línea ~77) y reemplazá:

```javascript
const getTshirtImageUrl = (view, color) => {
  // ANTES (placeholder):
  // const baseUrl = 'https://via.placeholder.com/...'
  
  // DESPUÉS (tus fotos):
  return `/assets/tshirts/tshirt-${view}-white.png`
}
```

### 6. Probar

```bash
npm run dev
```

Abrí http://localhost:5173 y verificá:
- ✅ La remera se ve realista
- ✅ Los colores se aplican correctamente
- ✅ Las vistas frente/espalda funcionan
- ✅ Los diseños se posicionan bien

### 7. Ajustar Posiciones (si es necesario)

Si los diseños no se posicionan bien en tu foto, ajustá en `ShirtCanvas.jsx`:

```javascript
const getIconPositions = (canvasWidth, canvasHeight, iconSize) => {
  // Ajustá estos valores según tu foto:
  const topY = canvasHeight * 0.20    // Posición superior
  const centerY = canvasHeight * 0.35 // Posición centro
  const bottomY = canvasHeight * 0.55 // Posición inferior
  
  const leftX = canvasWidth * 0.15    // Posición izquierda
  const rightX = canvasWidth * 0.55   // Posición derecha
  
  // ...
}
```

## Ejemplos de Fotos Ideales

### ✅ BUENA Foto
- Remera blanca
- Fondo neutro
- Iluminación uniforme
- Centrada y simétrica
- Alta resolución

### ❌ MALA Foto
- Remera de color (no funcionará el sistema)
- Fondo muy oscuro o con patrones
- Iluminación despareja
- Remera arrugada
- Baja resolución

## Recursos Útiles

**Remover Fondo:**
- https://remove.bg
- https://www.canva.com/features/background-remover/

**Mockups Gratuitos:**
- https://www.mockupworld.co
- https://www.freepik.com
- https://mockups-design.com

**Editar Fotos:**
- https://www.photopea.com (Photoshop online gratis)
- GIMP (software gratuito)

## Troubleshooting

**P: Los colores se ven raros**  
R: Asegurate que la remera en la foto sea BLANCA. Si es gris o crema, los colores no se aplicarán correctamente.

**P: La foto no se carga**  
R: Verificá que esté en `public/assets/tshirts/` y que el nombre sea exacto (case-sensitive).

**P: El diseño queda fuera de la remera**  
R: Ajustá las coordenadas en `getIconPositions()` según tu foto.

**P: La calidad de la imagen exportada es mala**  
R: Usá fotos de mayor resolución (min 1200x1500px).

## ¿Necesitás Ayuda?

Si tenés problemas:
1. Revisá la consola del navegador (F12)
2. Verificá que los nombres de archivo sean correctos
3. Asegurate que las fotos estén en la carpeta correcta
4. Probá con un mockup gratuito primero

---

**¡Listo! Ahora tenés remeras REALES en tu diseñador** 🎉

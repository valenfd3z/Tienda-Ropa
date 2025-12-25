# ⚠️ PLACEHOLDER - Reemplazar con Fotos Reales

Esta carpeta debe contener las fotos de tus remeras.

## Archivos Necesarios

Colocá aquí:
- `tshirt-front-white.png` - Foto de remera blanca vista frontal
- `tshirt-back-white.png` - Foto de remera blanca vista trasera

## Requisitos de las Fotos

- **Color:** Remera BLANCA (crucial para el sistema de colores)
- **Formato:** PNG (preferible) o JPG
- **Resolución:** Mínimo 800x1000px, ideal 1200x1500px
- **Fondo:** Blanco, gris claro, o transparente
- **Calidad:** Alta resolución, bien iluminada, sin arrugas

## Dónde Conseguir Fotos

1. **Fotografiar tus propias remeras**
   - Remera blanca sobre fondo blanco/gris
   - Iluminación uniforme
   - Vista frontal y trasera centradas

2. **Descargar mockups gratuitos**
   - https://www.mockupworld.co
   - https://www.freepik.com (buscar "white t-shirt mockup")
   - https://placeit.net

3. **Remover fondo de fotos existentes**
   - https://remove.bg
   - Guardar como PNG con transparencia

## Después de Agregar las Fotos

1. Verificá que los nombres sean exactos:
   - `tshirt-front-white.png`
   - `tshirt-back-white.png`

2. Actualizá `src/components/ShirtCanvas.jsx` línea ~77:
   ```javascript
   return `/assets/tshirts/tshirt-${view}-white.png`
   ```

3. Probá la app:
   ```bash
   npm run dev
   ```

## Más Información

Lee el archivo `GUIA-FOTOS.md` en la raíz del proyecto para instrucciones detalladas.

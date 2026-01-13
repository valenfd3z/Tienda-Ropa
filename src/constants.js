/*
 * Constantes Globales del Proyecto
 */

// Identificadores de tipos de prendas y vistas para consistencia en la lógica
export const VISTA_FRONTAL = 'front';
export const VISTA_TRASERA = 'back';
export const TIPO_REMERA = 'tshirt';
export const TIPO_MUSCULOSA = 'musculosa';

export const COLORES_DISPONIBLES = [
    { nombre: 'Blanco', valor: '#FFFFFF', esOscuro: false },
    { nombre: 'Gris Oscuro', valor: '#6B7280', esOscuro: true },
    { nombre: 'Negro', valor: '#1A1A1A', esOscuro: true },
    { nombre: 'Azul Marino', valor: '#1E3A8A', esOscuro: true },
    { nombre: 'Rojo', valor: '#DC2626', esOscuro: true },
    { nombre: 'Verde', valor: '#16A34A', esOscuro: true },
    { nombre: 'Turquesa', valor: '#06B6D4', esOscuro: false },
    { nombre: 'Celeste', valor: '#00A8FF', esOscuro: true },
    { nombre: 'Rosa', valor: '#EC4899', esOscuro: true },
    { nombre: 'Naranja', valor: '#F97316', esOscuro: true },
    { nombre: 'Amarillo', valor: '#FACC15', esOscuro: false },
]

export const MAPA_NOMBRES_COLORES = COLORES_DISPONIBLES.reduce((acumulador, actual) => {
    acumulador[actual.valor] = actual.nombre;
    return acumulador;
}, {})

/**
 * Mapeo de valores hexadecimales a identificadores de recursos (assets)
 * Se utiliza para construir las rutas dinámicas de las imágenes base.
 */
export const MAPA_RECURSOS_COLORES = {
    '#FFFFFF': 'white',
    '#6B7280': 'darkgray',
    '#1A1A1A': 'black',
    '#1E3A8A': 'navy',
    '#DC2626': 'red',
    '#16A34A': 'green',
    '#06B6D4': 'turquoise',
    '#00A8FF': 'lightblue',
    '#EC4899': 'pink',
    '#F97316': 'orange',
    '#FACC15': 'yellow',
}

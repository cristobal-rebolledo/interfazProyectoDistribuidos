# Cliente de Barajas - Documentación

Este módulo proporciona un cliente completo para interactuar con la API de barajas del juego de cartas. Funciona tanto en Node.js como en navegadores web.

## 📋 Características

- ✅ **Funciones básicas CRUD**: Crear, leer, actualizar y eliminar barajas
- ✅ **Gestión de cartas**: Agregar y remover cartas de las barajas
- ✅ **Manejo de eventos**: Sistema de eventos para actualizaciones en tiempo real
- ✅ **Estado centralizado**: Mantiene el estado de barajas y cartas seleccionadas
- ✅ **Compatible con Node.js y navegador**: Funciona en ambos entornos
- ✅ **Manejo de errores**: Gestión robusta de errores con mensajes informativos

## 🚀 Uso

### Opción 1: Node.js (CommonJS)

```javascript
const barajaAPI = require('./barajaClient.js');

// Obtener todas las barajas
try {
    const barajas = await barajaAPI.getBarajas();
    console.log('Barajas:', barajas);
} catch (error) {
    console.error('Error:', error.message);
}

// Crear una nueva baraja
try {
    const nuevaBaraja = await barajaAPI.createBaraja({
        name: 'Mi Baraja',
        userId: 1,
        sleevePath: 'path/to/sleeve.jpg' // opcional
    });
    console.log('Baraja creada:', nuevaBaraja);
} catch (error) {
    console.error('Error:', error.message);
}
```

### Opción 2: Navegador Web (BarajaManager)

#### Inclusión en HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Aplicación</title>
</head>
<body>
    <!-- Tu contenido HTML -->
    
    <script src="barajaClient.js"></script>
    <script>
        // Tu código JavaScript aquí
    </script>
</body>
</html>
```

#### Uso de la clase BarajaManager

```javascript
// Crear instancia del gestor
const barajaManager = new BarajaManager();

// Configurar listeners para eventos
barajaManager.addEventListener('barajasLoaded', (event) => {
    const barajas = event.detail;
    console.log('Barajas cargadas:', barajas);
    // Actualizar UI con las barajas
});

barajaManager.addEventListener('barajaSelected', (event) => {
    const { baraja, cartas } = event.detail;
    console.log('Baraja seleccionada:', baraja);
    console.log('Cartas en la baraja:', cartas);
    // Mostrar detalles de la baraja
});

barajaManager.addEventListener('error', (event) => {
    const { message, error } = event.detail;
    console.error('Error:', message, error);
    // Mostrar mensaje de error al usuario
});

// Cargar todas las barajas
try {
    await barajaManager.loadBarajas();
} catch (error) {
    console.error('Error al cargar barajas:', error);
}

// Seleccionar una baraja específica
try {
    await barajaManager.selectBaraja(1);
} catch (error) {
    console.error('Error al seleccionar baraja:', error);
}
```

#### Uso directo de las funciones API

```javascript
// También puedes usar las funciones directamente
try {
    const barajas = await window.BarajaAPI.getBarajas();
    console.log('Barajas:', barajas);
} catch (error) {
    console.error('Error:', error);
}
```

## 📖 API Reference

### Funciones Básicas

#### `getBarajas()`
Obtiene todas las barajas disponibles.
- **Retorna**: `Promise<Array>` - Lista de barajas
- **Ejemplo**: `const barajas = await getBarajas();`

#### `getBarajaById(id)`
Obtiene una baraja específica por su ID.
- **Parámetros**: 
  - `id` (number) - ID de la baraja
- **Retorna**: `Promise<Object>` - Datos de la baraja
- **Ejemplo**: `const baraja = await getBarajaById(1);`

#### `getBarajasByUser(userId)`
Obtiene todas las barajas de un usuario específico.
- **Parámetros**: 
  - `userId` (number) - ID del usuario
- **Retorna**: `Promise<Array>` - Lista de barajas del usuario
- **Ejemplo**: `const barajas = await getBarajasByUser(1);`

#### `createBaraja(barajaData)`
Crea una nueva baraja.
- **Parámetros**: 
  - `barajaData` (Object) - Datos de la baraja
    - `name` (string) - Nombre de la baraja
    - `userId` (number) - ID del usuario propietario
    - `sleevePath` (string, opcional) - Ruta de la imagen del sleeve
- **Retorna**: `Promise<Object>` - Baraja creada
- **Ejemplo**: 
```javascript
const baraja = await createBaraja({
    name: 'Baraja de Fuego',
    userId: 1,
    sleevePath: 'sleeves/fire_sleeve.jpg'
});
```

#### `updateBaraja(id, barajaData)`
Actualiza una baraja existente.
- **Parámetros**: 
  - `id` (number) - ID de la baraja a actualizar
  - `barajaData` (Object) - Nuevos datos de la baraja
    - `name` (string) - Nombre de la baraja
    - `userId` (number) - ID del usuario propietario
    - `sleevePath` (string, opcional) - Ruta de la imagen del sleeve
- **Retorna**: `Promise<Object>` - Baraja actualizada
- **Ejemplo**: 
```javascript
const baraja = await updateBaraja(1, {
    name: 'Nuevo Nombre',
    userId: 1,
    sleevePath: 'nuevo_sleeve.jpg'
});
```

#### `deleteBaraja(id)`
Elimina una baraja.
- **Parámetros**: 
  - `id` (number) - ID de la baraja a eliminar
- **Retorna**: `Promise<Object>` - Confirmación de eliminación
- **Ejemplo**: `await deleteBaraja(1);`

### Gestión de Cartas

#### `addCartaToBaraja(barajaId, cartaId, variacionImagen)`
Agrega una carta a una baraja.
- **Parámetros**: 
  - `barajaId` (number) - ID de la baraja
  - `cartaId` (number) - ID de la carta
  - `variacionImagen` (string, opcional) - Variación de imagen
- **Retorna**: `Promise<Object>` - Confirmación
- **Ejemplo**: `await addCartaToBaraja(1, 5, 'especial');`

#### `removeCartaFromBaraja(barajaId, cartaId)`
Remueve una carta de una baraja.
- **Parámetros**: 
  - `barajaId` (number) - ID de la baraja
  - `cartaId` (number) - ID de la carta
- **Retorna**: `Promise<Object>` - Confirmación
- **Ejemplo**: `await removeCartaFromBaraja(1, 5);`

#### `getCartasFromBaraja(barajaId)`
Obtiene todas las cartas de una baraja.
- **Parámetros**: 
  - `barajaId` (number) - ID de la baraja
- **Retorna**: `Promise<Array>` - Lista de cartas
- **Ejemplo**: `const cartas = await getCartasFromBaraja(1);`

## 🎯 Clase BarajaManager (Solo Navegador)

### Constructor
```javascript
const manager = new BarajaManager();
```

### Métodos Principales

#### `loadBarajas()`
Carga todas las barajas y emite evento `barajasLoaded`.

#### `loadBarajasByUser(userId)`
Carga barajas de un usuario específico y emite evento `barajasLoaded`.

#### `selectBaraja(barajaId)`
Selecciona una baraja y carga sus cartas, emite evento `barajaSelected`.

#### `createBaraja(barajaData)`
Crea una nueva baraja y actualiza el estado local, emite eventos `barajaCreated` y `barajasUpdated`.

#### `updateBaraja(id, barajaData)`
Actualiza una baraja y el estado local, emite eventos `barajaUpdated` y `barajasUpdated`.

#### `deleteBaraja(id)`
Elimina una baraja y actualiza el estado local, emite eventos `barajaDeleted` y `barajasUpdated`.

#### `addCartaToCurrentBaraja(cartaId, variacionImagen)`
Agrega una carta a la baraja actualmente seleccionada, emite evento `cartaAddedToBaraja`.

#### `removeCartaFromCurrentBaraja(cartaId)`
Remueve una carta de la baraja actual, emite evento `cartaRemovedFromBaraja`.

### Métodos de Estado

#### `getBarajas()`
Retorna las barajas cargadas actualmente.

#### `getCurrentBaraja()`
Retorna la baraja actualmente seleccionada.

#### `getCurrentCartasBaraja()`
Retorna las cartas de la baraja actual.

## 📡 Eventos (Solo BarajaManager)

### Eventos Disponibles

- **`barajasLoaded`**: Se emite cuando se cargan las barajas
  - `detail`: Array de barajas
  
- **`barajaSelected`**: Se emite cuando se selecciona una baraja
  - `detail`: `{ baraja: Object, cartas: Array }`
  
- **`barajaCreated`**: Se emite cuando se crea una nueva baraja
  - `detail`: Objeto de la baraja creada
  
- **`barajaUpdated`**: Se emite cuando se actualiza una baraja
  - `detail`: Objeto de la baraja actualizada
  
- **`barajaDeleted`**: Se emite cuando se elimina una baraja
  - `detail`: `{ id: number }`
  
- **`barajasUpdated`**: Se emite cuando la lista de barajas cambia
  - `detail`: Array actualizado de barajas
  
- **`cartaAddedToBaraja`**: Se emite cuando se agrega una carta a la baraja
  - `detail`: `{ barajaId: number, cartaId: number, cartas: Array }`
  
- **`cartaRemovedFromBaraja`**: Se emite cuando se remueve una carta de la baraja
  - `detail`: `{ barajaId: number, cartaId: number, cartas: Array }`
  
- **`error`**: Se emite cuando ocurre un error
  - `detail`: `{ message: string, error: Error }`

### Ejemplo de Manejo de Eventos

```javascript
const manager = new BarajaManager();

// Configurar todos los listeners
manager.addEventListener('barajasLoaded', (event) => {
    console.log('Barajas cargadas:', event.detail);
});

manager.addEventListener('barajaSelected', (event) => {
    const { baraja, cartas } = event.detail;
    console.log(`Baraja "${baraja.nombre}" seleccionada con ${cartas.length} cartas`);
});

manager.addEventListener('error', (event) => {
    const { message, error } = event.detail;
    alert(`Error: ${message}`);
    console.error(error);
});

// Cargar datos
await manager.loadBarajas();
```

## 🌐 Configuración

### URL Base de la API
Por defecto, el cliente apunta a `http://localhost:3030/api`. Puedes cambiar esto modificando la constante `API_BASE_URL` en el archivo `barajaClient.js`:

```javascript
const API_BASE_URL = 'https://tu-servidor.com/api';
```

## 🔧 Ejemplo Completo de Integración

Consulta el archivo `barajaManager.html` para ver un ejemplo completo de cómo integrar y usar la clase `BarajaManager` en una aplicación web con interfaz de usuario completa.

## ⚠️ Manejo de Errores

Todas las funciones pueden lanzar errores. Siempre usa try-catch:

```javascript
try {
    const resultado = await barajaManager.createBaraja(datos);
    console.log('Éxito:', resultado);
} catch (error) {
    console.error('Error:', error.message);
    // Mostrar mensaje al usuario
}
```

## 🏗️ Requisitos

- **Backend**: El servidor API debe estar ejecutándose en el puerto configurado
- **Navegador**: JavaScript ES6+ con soporte para fetch API y CustomEvent
- **Node.js**: Versión que soporte async/await (Node 8+)

## 📝 Notas Importantes

1. **CORS**: Si usas desde navegador, asegúrate de que el servidor tenga CORS configurado correctamente.
2. **Autenticación**: Actualmente no incluye autenticación. Agrégala según tus necesidades.
3. **Validación**: Las validaciones básicas se realizan en el frontend, pero el backend debe tener validaciones adicionales.
4. **Imágenes**: Las rutas de imágenes asumen que están en la carpeta `../images/` relativa al HTML.

# Shopmi Frontend

Frontend moderno para la aplicación de e-commerce Shopmi, construido con React, Vite y Tailwind CSS.

## Características

- 🛍️ **Catálogo de productos** con filtros por categoría, marca, precio y búsqueda
- 🛒 **Carrito de compras** persistente con localStorage
- 🔐 **Autenticación** con JWT y refresh tokens
- 📦 **Gestión de pedidos** para usuarios autenticados
- 📱 **Diseño responsive** con Tailwind CSS
- ⚡ **Rendimiento optimizado** con React Query para cache de datos

## Tecnologías utilizadas

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **React Query** - Gestión de estado del servidor
- **React Hook Form** - Manejo de formularios
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

3. Abrir http://localhost:3000 en el navegador

## Configuración

### Variables de entorno

El frontend está configurado para conectarse al gateway en `http://localhost:8080`. Si necesitas cambiar la URL base, modifica el archivo `src/services/api.js`.

### Proxy de desarrollo

Vite está configurado para hacer proxy de las peticiones `/api/*` al gateway en el puerto 8080.

## Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx      # Barra de navegación
│   └── ProductCard.jsx # Tarjeta de producto
├── context/            # Contextos de React
│   ├── AuthContext.jsx # Autenticación
│   └── CartContext.jsx # Carrito de compras
├── pages/              # Páginas principales
│   ├── HomePage.jsx    # Página de inicio
│   ├── LoginPage.jsx   # Página de login
│   ├── CartPage.jsx    # Página del carrito
│   ├── CheckoutPage.jsx # Página de checkout
│   └── OrdersPage.jsx  # Página de pedidos
├── services/           # Servicios de API
│   └── api.js         # Cliente HTTP y endpoints
├── App.jsx            # Componente principal
├── main.jsx           # Punto de entrada
└── index.css          # Estilos globales
```

## APIs consumidas

El frontend consume las siguientes APIs a través del gateway:

### Autenticación (`/auth`)
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/refresh` - Renovar token

### Productos (`/productos`)
- `GET /productos/public/ListarPorCategoria/{id}` - Productos por categoría
- `GET /productos/public/ListarTop5ProductosMasBaratos` - Top 5 más baratos
- `GET /productos/public/ObtenerProducto/{id}` - Detalle de producto
- `GET /productos/VerificarStock/{id}/{cantidad}` - Verificar stock

### Categorías (`/categorias`)
- `GET /categorias/public/ListarCategorias` - Listar categorías

### Marcas (`/marcas`)
- `GET /marcas/public/ListarMarcas` - Listar marcas

### Pedidos (`/pedidos`)
- `POST /pedidos/RegistrarPedido` - Crear pedido
- `GET /pedidos/ObtenerPedidos/{userId}` - Pedidos del usuario

## Funcionalidades principales

### 1. Catálogo de productos
- Filtros por categoría, marca, precio y búsqueda
- Vista de productos más baratos por defecto
- Tarjetas de producto con imagen, precio y stock

### 2. Carrito de compras
- Agregar/quitar productos
- Modificar cantidades
- Persistencia en localStorage
- Cálculo automático de totales

### 3. Autenticación
- Login con usuario y contraseña
- Manejo automático de tokens JWT
- Renovación automática de tokens
- Protección de rutas privadas

### 4. Gestión de pedidos
- Checkout con información de envío
- Historial de pedidos del usuario
- Estados de pedido (Pendiente, Completado, Cancelado)

## Scripts disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build

## Notas importantes

1. **Autenticación**: El sistema maneja automáticamente la renovación de tokens JWT
2. **Carrito**: Se persiste en localStorage para mantener los productos entre sesiones
3. **Responsive**: Diseñado para funcionar en dispositivos móviles y desktop
4. **Error handling**: Manejo de errores con notificaciones toast
5. **Loading states**: Estados de carga para mejor UX

## Próximas mejoras

- [ ] Página de detalle de producto
- [ ] Sistema de registro de usuarios
- [ ] Wishlist/favoritos
- [ ] Búsqueda avanzada
- [ ] Filtros adicionales
- [ ] Paginación de productos
- [ ] Sistema de reviews/calificaciones
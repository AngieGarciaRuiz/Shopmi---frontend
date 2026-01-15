# Credenciales de prueba para Shopmi

## Usuarios disponibles:

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `12345678`
- **Rol**: ADMIN

### Cliente
- **Usuario**: `cliente`
- **Contraseña**: `12345678`
- **Rol**: CLIENTE

### Vendedor
- **Usuario**: `vendedor`
- **Contraseña**: `12345678`
- **Rol**: VENDEDOR

## Endpoints funcionando:

### ✅ Públicos (sin autenticación):
- `GET /categorias/public/listarCategorias`
- `GET /marcas/public/ListarMarcas`
- `GET /productos/public/ListarTop5ProductosMasBaratos`

### ✅ Con autenticación:
- `POST /auth/login`
- `POST /auth/logout`
- `GET /productos/VerificarStock/{codProducto}/{cantidad}`
- `POST /pedidos/RegistrarPedido`

## Prueba de login:
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"12345678"}'
```
# Guía Rápida - Shopmi

## Problema: Frontend no conecta con los servicios

### Solución paso a paso:

## 1. Verificar que Docker esté corriendo
```bash
docker --version
docker ps
```

## 2. Iniciar los servicios backend
```bash
# Desde la raíz del proyecto
cd c:\Proyectos\DSWII_ProyectoShopmi-
docker-compose up -d
```

## 3. Verificar que los servicios estén corriendo
```bash
docker-compose ps
```

Deberías ver todos los servicios en estado "Up":
- mysql (puerto 3307)
- rabbitmq (puertos 5672, 15672)
- auth-service (puerto 8081)
- catalogo-service (puerto 8082)
- pedidos-service (puerto 8083)
- productos-service (puerto 8084)
- pagos-service (puerto 8085)
- api-gateway (puerto 8080)

## 4. Verificar que el gateway responda
```bash
# En PowerShell o navegador
curl http://localhost:8080/categorias/public/ListarCategorias
```

## 5. Iniciar el frontend
```bash
cd shopmi-frontend
npm install  # Solo la primera vez
npm run dev
```

## 6. Abrir en el navegador
```
http://localhost:3000
```

---

## Solución rápida con script
Ejecuta el archivo `iniciar-shopmi.bat` que iniciará todo automáticamente.

---

## Troubleshooting

### Error: "Network error" o "ERR_CONNECTION_REFUSED"
- Verifica que el gateway esté corriendo: `docker logs api-gateway`
- Verifica que el puerto 8080 esté libre: `netstat -ano | findstr :8080`

### Error: "CORS policy"
- El gateway debe tener configurado CORS para permitir peticiones desde localhost:3000
- Verifica la configuración del gateway

### Error: "Cannot connect to Docker daemon"
- Inicia Docker Desktop
- Espera a que Docker esté completamente iniciado

### Los servicios no inician
```bash
# Ver logs de un servicio específico
docker logs api-gateway
docker logs auth-service

# Reiniciar todos los servicios
docker-compose down
docker-compose up -d
```

### El frontend no carga
```bash
# Limpiar cache y reinstalar
cd shopmi-frontend
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

---

## URLs importantes

- **Frontend**: http://localhost:3000
- **Gateway**: http://localhost:8080
- **RabbitMQ Admin**: http://localhost:15672 (user: shopmi, pass: shopmi)
- **MySQL**: localhost:3307 (user: shopmi, pass: shopmi)

---

## Endpoints de prueba

### Públicos (sin autenticación):
- GET http://localhost:8080/categorias/public/ListarCategorias
- GET http://localhost:8080/marcas/public/ListarMarcas
- GET http://localhost:8080/productos/public/ListarTop5ProductosMasBaratos

### Con autenticación:
1. Login:
```bash
POST http://localhost:8080/auth/login
Body: {
  "username": "admin",
  "password": "admin123"
}
```

2. Usar el token en las siguientes peticiones:
```
Authorization: Bearer <accessToken>
```
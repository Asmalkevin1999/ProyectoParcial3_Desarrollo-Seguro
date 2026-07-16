# 🚀 Guía de Ejecución y Pruebas - Sistema ERP

## 📋 Requisitos Previos

- Docker Desktop instalado y ejecutándose
- Node.js 20+ instalado
- npm 11+ instalado
- PostgreSQL 16+ (se ejecuta en contenedor)
- Git instalado

---

## 🔧 Instalación Inicial

### 1. Clonar el repositorio

```bash
cd "d:\Desarrollo de S.Seguro\Parcial 3"
cd ProyectoParcial3_Desarrollo-Seguro
```

### 2. Instalar dependencias del Frontend

```bash
cd frontend/erp-web
npm install
cd ../..
```

### 3. Iniciar servicios con Docker Compose

```bash
cd backend
docker-compose up -d
```

Verificar que todos los servicios están ejecutándose:

```bash
docker-compose ps
```

Debería ver:
- ✅ api-gateway (puerto 3005)
- ✅ master-service (puerto 3000)
- ✅ user-service (puerto 3001)
- ✅ inventory-service (puerto 3002)
- ✅ sales-service (puerto 3003)
- ✅ hr-service (puerto 3004)
- ✅ postgres (puerto 5432)

### 4. Ejecutar migraciones de BD (primera vez)

```bash
cd backend/master-service

# Aplicar migraciones
npx prisma migrate deploy

# Ejecutar seed (datos iniciales)
npx prisma db seed
```

Debería ver:
```
=================================
Seed ejecutado correctamente
=================================
Usuario: admin
Contraseña: Admin2026!
Roles: ADMIN y EMPLOYEE
=================================
```

---

## ✅ Verificar que el Backend está Funcionando

### Test 1: Verificar Conectividad

```bash
# Desde PowerShell
curl -X GET http://localhost:3005/api/health

# Debería retornar: 200 OK
```

### Test 2: Ejecutar Script de Prueba Completo

```powershell
cd "d:\Desarrollo de S.Seguro\Parcial 3\ProyectoParcial3_Desarrollo-Seguro"
powershell -ExecutionPolicy Bypass -File TEST_AUTH_FLOW.ps1
```

**Resultado esperado**:
```
✅ PASO 1: LOGIN → Status 201
✅ PASO 2: SELECT ROLE → Status 201
✅ PASO 3: GET MENUS → Status 200
✅ ✅ ✅ FLUJO COMPLETO EXITOSO ✅ ✅ ✅
```

---

## 🎨 Ejecutar Frontend en Desarrollo

### 1. Abrir terminal en frontend

```bash
cd frontend/erp-web
```

### 2. Iniciar servidor de desarrollo

```bash
npm start
```

Debería ver:
```
✔ Building...
✔ Bundle complete...
➜  Local:   http://localhost:4200/
```

**Nota**: Si el puerto 4200 está en uso, Angular preguntará si usar otro puerto.

### 3. Abrir en navegador

```
http://localhost:4200
```

---

## 🔐 Prueba del Flujo Completo Manualmente

### Paso 1: Login

1. Abrir http://localhost:4200 (o el puerto mostrado)
2. Debería ver formulario de login
3. Ingresar:
   - **Usuario**: `admin`
   - **Contraseña**: `Admin2026!`
4. Hacer clic en "Ingresar"
5. Debería redirigir a `/select-role`

### Paso 2: Seleccionar Rol

1. Ver dropdown con roles disponibles
2. Seleccionar "ADMIN"
3. Hacer clic en "Seleccionar"
4. Debería redirigir a `/dashboard`

### Paso 3: Dashboard

1. Ver navbar con usuario "admin" y rol "ADMIN"
2. Ver sidebar con "Menú dinámico"
3. Ver módulo "Administración" expandido
4. Ver submenús:
   - "Usuarios" → /users
   - "Roles" → /roles

### Paso 4: Navegación

1. Hacer clic en "Usuarios"
2. Debería navegar a `/users` (si la ruta existe)
3. Hacer clic en "Roles"
4. Debería navegar a `/roles` (si la ruta existe)

---

## 🧪 Casos de Prueba Detallados

### TC-1: Login Exitoso

```
Entrada: username="admin", password="Admin2026!"
Esperado: 
  - Status 201
  - tempToken en localStorage
  - Redirect a /select-role
```

### TC-2: Login Fallido - Credenciales Inválidas

```
Entrada: username="admin", password="incorrecta"
Esperado:
  - Status 401
  - Mensaje de error: "Credenciales inválidas"
  - Permanecer en /login
```

### TC-3: Login Fallido - Usuario No Existe

```
Entrada: username="noexiste", password="cualquiera"
Esperado:
  - Status 404
  - Mensaje de error: "Usuario no encontrado"
```

### TC-4: Select Role Exitoso

```
Entrada: tempToken válido, roleId válido
Esperado:
  - Status 201
  - accessToken en localStorage
  - refreshToken en localStorage
  - Redirect a /dashboard
```

### TC-5: Select Role Fallido - Token Expirado

```
Entrada: tempToken expirado, roleId válido
Esperado:
  - Status 401
  - Mensaje: "Token inválido o expirado"
  - Redirect a /login (vía interceptor)
```

### TC-6: Get Menus Exitoso

```
Entrada: accessToken válido
Esperado:
  - Status 200
  - Array de módulos con menús
  - Menús ordenados por campo order
```

### TC-7: Get Menus Fallido - Sin Token

```
Entrada: Sin Authorization header
Esperado:
  - Status 401
  - Redirect a /login
```

### TC-8: Logout

```
Entrada: Click en botón "Salir"
Esperado:
  - localStorage vaciado
  - Redirect a /login
  - Todos los tokens eliminados
```

---

## 🐛 Troubleshooting

### Problema: "Port 3005 is already in use"

```bash
# Buscar proceso en el puerto
netstat -ano | findstr :3005

# Terminar proceso (reemplazar PID)
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
```

### Problema: "Cannot find module '@prisma/client'"

```bash
cd backend/master-service
npm install
npx prisma generate
```

### Problema: "Connection refused to postgresql://..."

```bash
# Verificar que postgres está corriendo
docker ps | grep postgres

# Si no aparece, iniciar compose
cd backend
docker-compose up -d postgres
```

### Problema: "Bearer token error" en login

```
1. Verificar que el interceptor está registrado en app.config.ts
2. Revisar que tokenInterceptor importa correctamente catchError
3. Verificar orden de tokens en localStorage
4. Limpiar localStorage: localStorage.clear()
```

### Problema: "CORS Error"

```
Solución: Revisar que CORS está habilitado en api-gateway
main.ts:
  app.enableCors()
```

### Problema: "Menús no aparecen en dashboard"

```
1. Verificar que GET /api/menus/my-menu retorna 200
2. Verificar que el accessToken es válido
3. Verificar que buildMenuTree() está funcionando
4. Revisar console.log del navegador (F12)
```

---

## 📊 Monitoreo y Logs

### Ver logs del Backend

```bash
# Todo los servicios
docker-compose logs -f

# Solo master-service
docker-compose logs -f master-service

# Solo api-gateway
docker-compose logs -f api-gateway

# Últimas 50 líneas
docker-compose logs --tail=50
```

### Ver logs del Frontend

```
1. Abrir DevTools: F12
2. Ir a pestaña "Console"
3. Buscar mensajes de error o warning
4. Network tab para ver requests HTTP
```

### Monitorear base de datos

```bash
# Conectarse a PostgreSQL
docker-compose exec postgres psql -U master_user -d master_gateway

# Comandos útiles:
\dt                 # Ver tablas
SELECT * FROM users;
SELECT * FROM roles;
SELECT * FROM user_roles;
\q                  # Salir
```

---

## 🔄 Reiniciar Servicios

### Reiniciar TODO

```bash
cd backend
docker-compose down -v  # -v para limpiar volúmenes
docker-compose up -d
npx prisma migrate deploy
npx prisma db seed
```

### Reiniciar solo un servicio

```bash
# Master Service
docker-compose restart master-service

# API Gateway
docker-compose restart api-gateway

# PostgreSQL
docker-compose restart postgres
```

### Limpiar caché y rebuildar

```bash
# Frontend
cd frontend/erp-web
rm -r node_modules dist
npm install
npm start

# Backend
cd backend/master-service
rm -r node_modules dist
npm install
npm run build
```

---

## 📱 Testing con Postman/Insomnia

### 1. Login

```
POST http://localhost:3005/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin2026!"
}
```

**Response**:
```json
{
  "message": "Seleccione un rol",
  "tempToken": "eyJhbGciOi...",
  "roles": [
    {
      "id": "1380db42-79cd-4971-bbb8-5674a1a9d169",
      "name": "ADMIN"
    }
  ]
}
```

### 2. Select Role

```
POST http://localhost:3005/api/auth/select-role
Authorization: Bearer {tempToken}
Content-Type: application/json

{
  "roleId": "1380db42-79cd-4971-bbb8-5674a1a9d169"
}
```

**Response**:
```json
{
  "message": "Rol seleccionado correctamente",
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "role": "ADMIN"
}
```

### 3. Get Menus

```
GET http://localhost:3005/api/menus/my-menu
Authorization: Bearer {accessToken}
```

**Response**:
```json
[
  {
    "id": "4e898d30-dfbe-4681-a238-e411c38214c5",
    "name": "Administración",
    "menus": [
      {
        "id": "ab998a0d-ca51-4990-ab66-2f58cae8f20f",
        "name": "Usuarios",
        "url": "/users",
        "order": 1
      },
      {
        "id": "91739112-c302-4e8c-b2c4-09c8f9f2dd35",
        "name": "Roles",
        "url": "/roles",
        "order": 2
      }
    ]
  }
]
```

---

## ✨ Checklist de Validación

- [ ] Docker Desktop está ejecutándose
- [ ] `docker-compose ps` muestra todos los servicios UP
- [ ] `npm install` completado en frontend
- [ ] Migraciones ejecutadas: `prisma migrate deploy`
- [ ] Seed ejecutado: `prisma db seed`
- [ ] Frontend compilando sin errores: `npm start`
- [ ] Navegador abierto en http://localhost:4200
- [ ] Login funciona con admin/Admin2026!
- [ ] Select-role muestra roles disponibles
- [ ] Dashboard carga correctamente
- [ ] Menús dinámicos se renderizan
- [ ] Submenús expandibles funcionan
- [ ] Test script `TEST_AUTH_FLOW.ps1` ejecuta exitosamente

---

## 🎓 Próximas Mejoras (Opcionales)

- [ ] Implementar refresh token automático
- [ ] Agregar route guards por rol
- [ ] Crear módulos para otros servicios
- [ ] Agregar paginación en listados
- [ ] Implementar búsqueda y filtros
- [ ] Agregar notificaciones toast
- [ ] Crear temas claro/oscuro
- [ ] Implementar darkmode
- [ ] Agregar unit tests
- [ ] Agregar e2e tests con Cypress/Playwright

---

## 📞 Documentación Adicional

- [RESUMEN_CORRECCIONES.md](RESUMEN_CORRECCIONES.md) - Cambios aplicados
- [DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md) - Arquitectura detallada
- [README.md](README.md) - Descripción general del proyecto

---

**Versión**: 1.0  
**Última actualización**: 2026-07-16  
**Status**: ✅ Completo y Operativo

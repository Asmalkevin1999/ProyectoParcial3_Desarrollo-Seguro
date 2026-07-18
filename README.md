# 🔐 Sistema ERP Seguro - Desarrollo Parcial 3

## 📌 Estado del Proyecto

**✅ COMPLETADO Y FUNCIONAL**

Este es un sistema ERP enterprise-grade con:
- ✅ Autenticación basada en JWT (2 fases)
- ✅ Menús dinámicos por rol
- ✅ 6 Microservicios NestJS
- ✅ Base de datos PostgreSQL
- ✅ Frontend Angular 22 Standalone
- ✅ Seguridad implementada

---

## 🚀 Quick Start (5 minutos)

### 1. Verificar Prerequisites
```bash
# Docker Desktop ejecutándose
docker --version

# Node.js 20+
node --version  # v20+
npm --version   # 11+
```

### 2. Iniciar Backend
```bash
cd backend
docker-compose up -d
```

Verificar todos los servicios UP:
```bash
docker-compose ps
```

### 3. Iniciar Frontend
```bash
cd frontend/erp-web
npm install
npm start
```

### 4. Abrir en Navegador
```
http://localhost:4200  (o puerto mostrado)
```

### 5. Ingresar Credenciales
```
Usuario: admin
Contraseña: Admin2026!
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| **[PROYECTO_COMPLETADO.md](PROYECTO_COMPLETADO.md)** | 📋 Resumen ejecutivo del proyecto |
| **[RESUMEN_CORRECCIONES.md](RESUMEN_CORRECCIONES.md)** | 🔧 Detalle técnico de correcciones |
| **[DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md)** | 📚 Documentación de arquitectura y API |
| **[GUIA_EJECUCION.md](GUIA_EJECUCION.md)** | 🚀 Guía paso a paso de ejecución |

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────┐
│  Frontend Angular 22 (4200)     │
│  ├─ Standalone Components       │
│  ├─ Token Interceptor           │
│  └─ Menús Dinámicos             │
└────────────┬────────────────────┘
             │ HTTP + JWT
┌────────────▼────────────────────┐
│  API Gateway (3005)             │
│  └─ MasterClient Forwarding     │
└────────────┬────────────────────┘
             │
  ┌──────────┼──────────────┬──────────┐
  │          │              │          │
Master-  User-        Inventory-   Sales-
Service  Service      Service      Service
3000     3001         3002         3003

  HR-Service    (3004)
  
┌─────────────────────────────────┐
│  PostgreSQL Database (5432)     │
│  ├─ users, roles                │
│  ├─ modules, menus              │
│  └─ role_modules, role_menus    │
└─────────────────────────────────┘
```

---

## 🔒 Flujo de Autenticación

### Paso 1: Login
```
POST /api/auth/login
{username: "admin", password: "Admin2026!"}
→ ✅ tempToken (5 min) + roles
```

### Paso 2: Select Role
```
POST /api/auth/select-role
Authorization: Bearer {tempToken}
{roleId: "..."}
→ ✅ accessToken (15 min) + refreshToken (7d)
```

### Paso 3: Dashboard
```
GET /api/menus/my-menu
Authorization: Bearer {accessToken}
→ ✅ Módulos con menús jerárquicos
```

---

## 📦 Tecnologías

### Frontend
- **Angular 22** - Framework web
- **TypeScript** - Lenguaje tipado
- **Bootstrap 5** - UI Framework
- **Angular Material** - Componentes
- **RxJS** - Programación reactiva

### Backend
- **NestJS 10** - Framework Node.js
- **Prisma** - ORM
- **JWT** - Autenticación
- **PostgreSQL** - Base de datos
- **Docker** - Contenedores

### DevOps
- **Docker Compose** - Orquestación
- **PostgreSQL 16** - BD
- **npm** - Package manager
- **Git** - Control de versiones

### Estrategia de ramas
- `main`: producción. Solo PR desde `test`.
- `test`: pruebas/QA. Integración validada aquí antes de promover a `main`.
- `dev`: desarrollo. Las ramas de feature se crean desde `dev` y se integran de vuelta a `dev`.

### GitHub Actions y secretos
- Archivo principal: `.github/workflows/ci-cd.yml`
- Se ejecuta en `push` a `main`.
- Requiere secretos de GitHub:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
  - `SONAR_TOKEN`
  - `SONAR_ORGANIZATION`
  - `SONAR_PROJECT_KEY`
  - `RAILWAY_TOKEN` o `RENDER_TOKEN`
  - `RENDER_SERVICE_ID` (si se usa Render)
- Las credenciales nunca deben almacenarse en el código.

---

## ✨ Correcciones Aplicadas

### 1. Token Interceptor ✅
```typescript
// ANTES: ❌ localStorage.getItem('accessToken') || tempToken
// DESPUÉS: ✅ localStorage.getItem('tempToken') || accessToken
```

### 2. Auth Service (selectRole) ✅
- Formato de query Prisma corregido
- Variable scope issues resueltos
- Validación de roleId agregada

### 3. API Service ✅
- Fallback de tokens implementado
- Headers centralizados

### 4. Menu Service ✅
- Refactorizado a usar ApiService
- Eliminada duplicación de código

### 5. Dashboard Component ✅
- Árbol jerárquico de menús
- Spinner de carga
- Error handling robusto

---

## 🧪 Testing

### Test Automático
```powershell
powershell -ExecutionPolicy Bypass -File TEST_AUTH_FLOW.ps1
```

**Resultado esperado**: ✅ FLUJO COMPLETO EXITOSO

### Test Manual (Postman/Insomnia)
```
1. POST /api/auth/login
2. POST /api/auth/select-role
3. GET /api/menus/my-menu
```

---

## 📊 Estructura del Proyecto

```
ProyectoParcial3_Desarrollo-Seguro/
├── frontend/
│   └── erp-web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── auth/
│       │   │   ├── interceptors/
│       │   │   └── modules/
│       │   └── index.html
│       ├── package.json
│       └── angular.json
├── backend/
│   ├── api-gateway/
│   ├── master-service/
│   ├── user-service/
│   ├── inventory-service/
│   ├── sales-service/
│   ├── hr-service/
│   ├── docker-compose.yml
│   └── database/
├── ai-detector/
├── docs/
├── PROYECTO_COMPLETADO.md ⭐
├── RESUMEN_CORRECCIONES.md
├── DOCUMENTACION_COMPLETA.md
├── GUIA_EJECUCION.md
├── TEST_AUTH_FLOW.ps1
└── README.md
```

---

## 🔧 Troubleshooting

### Problema: Puerto en uso
```bash
netstat -ano | findstr :3005
taskkill /PID <PID> /F
```

### Problema: Token Error
```
1. Limpiar localStorage: localStorage.clear()
2. Verificar interceptor registrado en app.config.ts
3. Revisar console del navegador (F12)
```

### Problema: BD Connection
```bash
docker-compose logs postgres
docker-compose restart postgres
```

### Problema: Menús no aparecen
```
1. Verificar GET /api/menus/my-menu retorna 200
2. Verificar accessToken válido
3. Revisar Network tab (F12)
```

---

## 📞 Contacto y Soporte

Para problemas:
1. Revisar logs: `docker-compose logs -f`
2. Revisar console del navegador (F12)
3. Consultar [GUIA_EJECUCION.md](GUIA_EJECUCION.md)
4. Consultar [DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md)

---

## 📈 Próximas Mejoras (Opcionales)

- [ ] Refresh token automático
- [ ] Route guards por rol
- [ ] Unit tests (Jest)
- [ ] E2E tests (Cypress)
- [ ] Analytics
- [ ] WebSockets (tiempo real)
- [ ] OAuth integration
- [ ] Tema claro/oscuro

---

## 👤 Información del Usuario

- **Usuario**: admin
- **Contraseña**: Admin2026!
- **Rol**: ADMIN
- **Módulos**: Administración (Usuarios, Roles)

---

## ✅ Checklist de Validación

- [x] Backend corriendo en Docker
- [x] Frontend compilando sin errores
- [x] Login funciona
- [x] Select role funciona
- [x] Dashboard carga
- [x] Menús dinámicos se renderizan
- [x] Submenús funcionales
- [x] Documentación completa
- [x] Tests ejecutados exitosamente

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| Status | ✅ Operativo |
| Componentes | 15+ |
| Servicios | 8+ |
| Endpoints | 20+ |
| Tablas DB | 8 |
| Microservicios | 6 |
| Documentación | 4 docs |
| Tiempo Setup | ~2 min |

---

## 📜 Licencia

MIT - Libre para usar y modificar

---

## 🎓 Créditos

Desarrollado como parte del **Parcial 3 de Desarrollo Seguro**

Implementación de:
- Autenticación JWT
- Menús dinámicos por rol
- Microservicios NestJS
- Frontend Angular Standalone
- Base de datos PostgreSQL

---

**Versión**: 1.0  
**Última actualización**: 2026-07-16  
**Status**: ✅ Completo y Funcional

---

## 🔗 Enlaces Rápidos

- 📋 [Resumen Ejecutivo](PROYECTO_COMPLETADO.md)
- 🔧 [Correcciones Técnicas](RESUMEN_CORRECCIONES.md)
- 📚 [Documentación Técnica](DOCUMENTACION_COMPLETA.md)
- 🚀 [Guía de Ejecución](GUIA_EJECUCION.md)
- 🧪 [Test Script](TEST_AUTH_FLOW.ps1)

---

¡Proyecto listo para producción! 🚀
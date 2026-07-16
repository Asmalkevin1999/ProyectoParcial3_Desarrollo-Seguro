# 📚 Documentación Completa del ERP - Sistema Seguro

## 📋 Índice de Contenidos

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Flujo de Autenticación](#flujo-de-autenticación)
3. [Configuración de Microservicios](#configuración-de-microservicios)
4. [Base de Datos](#base-de-datos)
5. [Frontend Angular](#frontend-angular)
6. [API REST](#api-rest)
7. [Seguridad](#seguridad)
8. [Deployment](#deployment)

---

## Estructura del Proyecto

```
ProyectoParcial3_Desarrollo-Seguro/
├── ai-detector/                      # Módulo Python para detección de IA
│   ├── src/
│   │   ├── api/
│   │   │   └── app.py               # API Flask
│   │   ├── ml/
│   │   │   ├── train.py             # Entrenamiento de modelos
│   │   │   ├── predict.py           # Predicciones
│   │   │   └── scan_project.py      # Análisis de proyectos
│   │   ├── ci_cd/
│   │   │   └── security_check.py    # Verificaciones de seguridad
│   │   └── notifications/
│   │       └── telegram_bot.py      # Notificaciones
│   ├── models/
│   │   └── model.joblib             # Modelo entrenado
│   ├── data/
│   │   ├── juliet_balanced.csv      # Dataset
│   │   └── juliet/                  # Datos de entrenamiento
│   ├── test/
│   ├── Dockerfile
│   └── requirements.txt
│
├── backend/                          # Microservicios NestJS
│   ├── api-gateway/                 # Puerto 3005
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── ...
│   │   │   ├── clients/
│   │   │   │   └── master.client.ts # Cliente HTTP a master-service
│   │   │   └── ...
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .env
│   │
│   ├── master-service/              # Puerto 3000 - Autenticación
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts  # Lógica de autenticación
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── menus/               # Gestión de menús
│   │   │   │   └── menus.service.ts
│   │   │   └── ...
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Modelos de BD
│   │   │   ├── seed.ts              # Datos iniciales
│   │   │   └── migrations/
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .env
│   │
│   ├── user-service/                # Puerto 3001
│   ├── inventory-service/           # Puerto 3002
│   ├── sales-service/               # Puerto 3003
│   ├── hr-service/                  # Puerto 3004
│   ├── docker-compose.yml
│   └── database/                    # Scripts SQL
│
├── frontend/                         # Angular 22
│   └── erp-web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── auth/
│       │   │   │   ├── login/
│       │   │   │   │   ├── login.ts
│       │   │   │   │   └── login.html
│       │   │   │   ├── services/
│       │   │   │   │   ├── auth.service.ts    # Servicio de autenticación
│       │   │   │   │   ├── api.service.ts     # Wrapper HTTP centralizado
│       │   │   │   │   ├── menu.service.ts
│       │   │   │   │   └── select-role.service.ts
│       │   │   │   └── components/
│       │   │   ├── interceptors/
│       │   │   │   └── token-interceptor.ts   # Adjunta JWT a requests
│       │   │   ├── layout/
│       │   │   │   └── dashboard/
│       │   │   │       ├── dashboard.ts       # Componente principal
│       │   │   │       └── dashboard.html
│       │   │   ├── modules/                   # Feature modules
│       │   │   │   ├── users/
│       │   │   │   ├── roles/
│       │   │   │   ├── menus/
│       │   │   │   ├── modules/
│       │   │   │   ├── profile/
│       │   │   │   ├── role-modules/
│       │   │   │   ├── role-menus/
│       │   │   │   └── user-roles/
│       │   │   ├── app.config.ts             # Configuración de app
│       │   │   ├── app.routes.ts             # Rutas
│       │   │   └── environments/
│       │   │       └── environment.ts         # Variables de entorno
│       │   └── index.html
│       ├── package.json
│       ├── angular.json
│       ├── tsconfig.json
│       ├── Dockerfile
│       └── README.md
│
├── docs/                             # Documentación
├── docker-compose.yml               # Orquestación de contenedores
├── sonar-project.properties         # Configuración SonarQube
├── RESUMEN_CORRECCIONES.md          # Este documento
└── README.md
```

---

## Flujo de Autenticación

### Fase 1: LOGIN

```
1. Usuario ingresa credenciales en frontend

2. Frontend envía: POST /api/auth/login
   {
     "username": "admin",
     "password": "Admin2026!"
   }

3. Backend (master-service) valida credenciales

4. Backend retorna: ✅ Status 201
   {
     "message": "Seleccione un rol",
     "tempToken": "eyJhbGciOi...",    // 5 min expiration
     "roles": [
       {
         "id": "1380db42-...",
         "name": "ADMIN",
         "description": "Administrador del sistema"
       }
     ]
   }

5. Frontend almacena:
   - localStorage.setItem('tempToken', tempToken)
   - localStorage.setItem('roles', JSON.stringify(roles))
   - localStorage.setItem('username', username)

6. Frontend redirige a: /select-role
```

### Fase 2: SELECT ROLE

```
1. Usuario selecciona rol del dropdown

2. Frontend envía: POST /api/auth/select-role
   Headers: Authorization: Bearer {tempToken}
   Body: {
     "roleId": "1380db42-79cd-4971-bbb8-5674a1a9d169"
   }

3. Backend (master-service):
   a) Valida que tempToken.type === 'TEMP'
   b) Busca UserRole con status=true
   c) Genera accessToken (15 min) y refreshToken (7d)
   d) Guarda refreshToken en BD
   e) Retorna tokens

4. Backend retorna: ✅ Status 201
   {
     "message": "Rol seleccionado correctamente",
     "accessToken": "eyJhbGciOi...",     // 15 min
     "refreshToken": "eyJhbGciOi...",    // 7 days
     "role": "ADMIN"
   }

5. Frontend almacena:
   - localStorage.setItem('accessToken', accessToken)
   - localStorage.setItem('refreshToken', refreshToken)
   - localStorage.removeItem('tempToken')  // Limpiar

6. Frontend redirige a: /dashboard
```

### Fase 3: OPERACIONES PROTEGIDAS

```
1. Frontend realiza request: GET /api/menus/my-menu
   - Interceptor automáticamente adjunta: Authorization: Bearer {accessToken}

2. Backend (master-service):
   a) JwtAuthGuard valida el token
   b) Obtiene roleId del payload
   c) Query: Módulos → RoleModules → RoleMenus
   d) Retorna estructura jerárquica

3. Backend retorna: ✅ Status 200
   [
     {
       "id": "4e898d30-...",
       "name": "Administración",
       "menus": [
         {
           "id": "ab998a0d-...",
           "name": "Usuarios",
           "url": "/users",
           "order": 1,
           "parentId": null
         },
         {
           "id": "91739112-...",
           "name": "Roles",
           "url": "/roles",
           "order": 2,
           "parentId": null
         }
       ]
     }
   ]

4. Frontend:
   a) Construye árbol jerárquico con buildMenuTree()
   b) Renderiza componentes con *ngFor
   c) Muestra menús y submenús
```

### Manejo de Errores

```
401 Unauthorized:
├─ Token expirado
├─ Token inválido
├─ JWT signature no válida
└─ Acción: Interceptor limpia localStorage y redirige a /login

400 Bad Request:
├─ Credenciales inválidas
├─ roleId vacío o inválido
└─ Validación de entrada fallida

500 Internal Server Error:
├─ Error en base de datos
├─ Error en generación de tokens
└─ Error de configuración de servicios
```

---

## Configuración de Microservicios

### Variables de Entorno - Master Service

```
DATABASE_URL=postgresql://master_user:Master2026!@postgres:5432/master_gateway?schema=public
JWT_ACCESS_SECRET=MasterGatewayAccessSecret2026_ESPE_Parcial3
JWT_REFRESH_SECRET=MasterGatewayRefreshSecret2026_ESPE_Parcial3
NODE_ENV=development
PORT=3000
```

### Variables de Entorno - API Gateway

```
MASTER_SERVICE_URL=http://master-service:3000
NODE_ENV=development
PORT=3005
```

### Docker Compose Services

```yaml
Services:
├── api-gateway:3005        → Frontend (requests)
│   └── Forwarding to master-service:3000
├── master-service:3000     → Auth, Menus, Roles, Users
│   └── PostgreSQL:5432
├── user-service:3001       → Gestión de usuarios
├── inventory-service:3002  → Inventario
├── sales-service:3003      → Ventas
├── hr-service:3004         → Recursos humanos
└── postgres:5432           → Base de datos

Redes:
└── backend network → Comunicación entre contenedores
```

---

## Base de Datos

### Modelos Prisma

```typescript
// USUARIOS
model User {
  id: String @id @default(uuid())
  username: String @unique
  email: String @unique
  password: String (bcrypt hash)
  firstName: String
  lastName: String
  status: Boolean @default(true)
  
  roles: UserRole[]
  refreshTokens: RefreshToken[]
}

// ROLES (ADMIN, EMPLOYEE, etc.)
model Role {
  id: String @id @default(uuid())
  name: String @unique
  description: String?
  status: Boolean @default(true)
  
  users: UserRole[]
  roleModules: RoleModule[]
  roleMenus: RoleMenu[]
  refreshTokens: RefreshToken[]
}

// RELACIÓN MUCHOS-MUCHOS: USUARIOS ↔ ROLES
model UserRole {
  id: String @id
  userId: String @db.Uuid
  roleId: String @db.Uuid
  status: Boolean @default(true)
  
  user: User @relation(fields: [userId])
  role: Role @relation(fields: [roleId])
  
  @@unique([userId, roleId])
}

// MÓDULOS (Administración, Ventas, etc.)
model Module {
  id: String @id @default(uuid())
  name: String @unique
  description: String?
  icon: String?
  status: Boolean @default(true)
  
  menus: Menu[]
  roleModules: RoleModule[]
}

// MENÚS (Items de navegación)
model Menu {
  id: String @id @default(uuid())
  name: String
  url: String?
  icon: String?
  order: Int
  
  moduleId: String @db.Uuid
  parentId: String? @db.Uuid  // Submenús
  
  module: Module @relation(fields: [moduleId])
  parent: Menu? @relation("MenuHierarchy", fields: [parentId])
  children: Menu[] @relation("MenuHierarchy")
  roleMenus: RoleMenu[]
}

// RELACIÓN: ROLES ↔ MÓDULOS
model RoleModule {
  id: String @id
  roleId: String @db.Uuid
  moduleId: String @db.Uuid
  status: Boolean @default(true)
  
  @@unique([roleId, moduleId])
}

// RELACIÓN: ROLES ↔ MENÚS
model RoleMenu {
  id: String @id
  roleId: String @db.Uuid
  menuId: String @db.Uuid
  status: Boolean @default(true)
  
  @@unique([roleId, menuId])
}

// TOKENS DE REFRESCO
model RefreshToken {
  id: String @id @default(uuid())
  token: String @unique
  userId: String @db.Uuid
  roleId: String @db.Uuid
  expiresAt: DateTime
  revoked: Boolean @default(false)
  
  user: User @relation(fields: [userId])
  role: Role @relation(fields: [roleId])
}
```

### Consultas Principales

**Obtener menús por rol**:
```sql
SELECT m.*, r.name as role_name
FROM role_menus rm
JOIN menus m ON rm.menu_id = m.id
JOIN roles r ON rm.role_id = r.id
WHERE rm.role_id = $1 AND rm.status = true
ORDER BY m.order ASC;
```

**Obtener módulos por rol**:
```sql
SELECT m.*, r.name as role_name
FROM role_modules rm
JOIN modules m ON rm.module_id = m.id
JOIN roles r ON rm.role_id = r.id
WHERE rm.role_id = $1 AND rm.status = true;
```

---

## Frontend Angular

### Estructura de Componentes

```
AppConfig (Bootstrapper)
├── withInterceptors([tokenInterceptor])
├── withHttpClient()
└── Routes:
    ├── /login → LoginComponent (standalone)
    ├── /select-role → SelectRoleComponent (standalone)
    └── /dashboard → DashboardComponent (standalone)
        ├── Sidebar (menú dinámico)
        ├── Header (usuario, rol, salir)
        └── Main (contenido)
```

### Servicios

**AuthService**:
```typescript
class AuthService {
  login(credentials): Observable<LoginResponse>
  logout(): void
  isAuthenticated(): boolean
}
```

**ApiService**:
```typescript
class ApiService {
  get(url: string): Observable<any>
  post(url: string, body: any): Observable<any>
  put(url: string, body: any): Observable<any>
  delete(url: string): Observable<any>
  
  private headers(): HttpHeaders  // Adjunta tokens
}
```

**MenuService**:
```typescript
class MenuService {
  getMyMenu(): Observable<ModuleMenu[]>  // GET /api/menus/my-menu
}
```

**SelectRoleService**:
```typescript
class SelectRoleService {
  selectRole(roleId: string): Observable<SelectRoleResponse>  // POST /api/auth/select-role
}
```

### Interceptor de Tokens

```typescript
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Intentar usar tempToken (para login/select-role)
  // 2. Si no existe, usar accessToken (para operaciones)
  // 3. Adjuntar a header Authorization: Bearer
  // 4. Si 401, limpiar y redirigir a login
  
  const token = localStorage.getItem('tempToken') || 
                localStorage.getItem('accessToken');
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req).pipe(
    catchError((err) => {
      if (err?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return throwError(() => err);
    })
  );
};
```

### Construcción del Árbol de Menús

```typescript
interface MenuItem {
  id: string;
  name: string;
  url?: string;
  order: number;
  parentId?: string;
  children?: MenuItem[];
}

buildMenuTree(flatMenus: MenuItem[]): MenuItem[] {
  const menuMap = new Map<string, MenuItem>();
  
  // 1. Crear mapa de todos los ítems
  flatMenus.forEach(menu => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });
  
  // 2. Construir relaciones padre-hijo
  const roots: MenuItem[] = [];
  flatMenus.forEach(menu => {
    if (menu.parentId) {
      menuMap.get(menu.parentId)?.children?.push(menuMap.get(menu.id)!);
    } else {
      roots.push(menuMap.get(menu.id)!);
    }
  });
  
  // 3. Ordenar por campo order
  return roots.sort((a, b) => a.order - b.order);
}
```

---

## API REST

### Endpoints de Autenticación

#### Login
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "username": "admin",
  "password": "Admin2026!"
}

Response: 201 Created
{
  "message": "Seleccione un rol",
  "tempToken": "eyJhbGciOiJIUzI1NiIs...",
  "roles": [
    {
      "id": "1380db42-79cd-4971-bbb8-5674a1a9d169",
      "name": "ADMIN",
      "description": "Administrador del sistema"
    }
  ]
}

Error: 400 Bad Request
{
  "message": ["username should not be empty", "password should not be empty"],
  "error": "Bad Request",
  "statusCode": 400
}
```

#### Select Role
```
POST /api/auth/select-role
Authorization: Bearer {tempToken}
Content-Type: application/json

Request:
{
  "roleId": "1380db42-79cd-4971-bbb8-5674a1a9d169"
}

Response: 201 Created
{
  "message": "Rol seleccionado correctamente",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "role": "ADMIN"
}

Error: 401 Unauthorized
{
  "message": "Token inválido o expirado",
  "error": "Unauthorized",
  "statusCode": 401
}
```

#### Refresh Token
```
POST /api/auth/refresh
Authorization: Bearer {refreshToken}

Response: 200 OK
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Endpoints de Menús

#### Obtener Menús del Usuario
```
GET /api/menus/my-menu
Authorization: Bearer {accessToken}

Response: 200 OK
[
  {
    "id": "4e898d30-dfbe-4681-a238-e411c38214c5",
    "name": "Administración",
    "description": "Módulo principal del sistema",
    "icon": null,
    "menus": [
      {
        "id": "ab998a0d-ca51-4990-ab66-2f58cae8f20f",
        "name": "Usuarios",
        "url": "/users",
        "icon": null,
        "order": 1,
        "parentId": null
      },
      {
        "id": "91739112-c302-4e8c-b2c4-09c8f9f2dd35",
        "name": "Roles",
        "url": "/roles",
        "icon": null,
        "order": 2,
        "parentId": null
      }
    ]
  }
]
```

---

## Seguridad

### JWT Strategy

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'MasterGatewayAccessSecret2026_ESPE_Parcial3',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username,
      roleId: payload.roleId,
      role: payload.role,
      type: payload.type,
    };
  }
}
```

### Guardias de Autenticación

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@UseGuards(JwtAuthGuard)
@Post('select-role')
selectRole(@Req() req, @Body() dto: SelectRoleDto) {
  // req.user contiene los datos validados del JWT
  return this.auth.selectRole(req.user, dto.roleId);
}
```

### Bcrypt Password Hashing

```typescript
// En el seed:
const password = await bcrypt.hash('Admin2026!', 12);

// En auth.service (login):
const isPasswordValid = await bcrypt.compare(
  loginDto.password,
  user.password
);
```

### Validaciones

```typescript
// Login DTO
export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

// Select Role DTO
export class SelectRoleDto {
  @IsNotEmpty()
  @IsUUID()
  roleId: string;
}
```

---

## Deployment

### Docker Compose

```bash
# Construir y ejecutar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Limpiar volúmenes
docker-compose down -v
```

### Dockerfile - Frontend

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4200
CMD ["npm", "start"]
```

### Dockerfile - Backend (NestJS)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Variables de Entorno en Producción

```bash
# Master Service
DATABASE_URL=postgresql://user:pass@postgres:5432/db
JWT_ACCESS_SECRET=<secret-largo-seguro>
JWT_REFRESH_SECRET=<secret-largo-seguro>
NODE_ENV=production

# API Gateway
MASTER_SERVICE_URL=http://master-service:3000
NODE_ENV=production

# Frontend
API_URL=https://api.tudominio.com
```

---

## 🎯 Checklist de Deployments

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada (`prisma migrate deploy`)
- [ ] Seed ejecutado (`prisma db seed`)
- [ ] Tests pasados (`npm test`)
- [ ] Build exitoso (`npm run build`)
- [ ] Logs revisados sin errores
- [ ] Endpoints testados manualmente
- [ ] SSL/TLS configurado en producción
- [ ] CORS configurado correctamente
- [ ] Rate limiting implementado
- [ ] Monitoring/alertas configuradas

---

## 📞 Soporte y Contacto

Para preguntas o problemas:
1. Revisar logs: `docker logs <service-name>`
2. Verificar conectividad: `docker-compose logs -f`
3. Validar configuración de variables de entorno
4. Revisar la base de datos con `psql`
5. Ejecutar POST de prueba con curl/Postman

---

**Última actualización**: 2026-07-16  
**Status**: ✅ Completo y Operativo

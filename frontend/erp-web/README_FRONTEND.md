Frontend (erp-web) - Desarrollo y pruebas

Pasos rápidos para desarrollo:

1. Instalar dependencias

```bash
cd frontend/erp-web
npm install
```

2. Levantar servidor de desarrollo

```bash
ng serve --host 0.0.0.0
```

3. Variables importantes
- `environment.apiUrl` debe apuntar al gateway (por defecto `http://localhost:3005`).

4. Comprobaciones rápidas
- Asegúrate de que el gateway y los microservicios estén levantados (docker compose up -d --build en `backend`).
- Iniciar sesión → seleccionar rol → verificar que `accessToken` está en `localStorage`.
- Ir a Dashboard y comprobar que el menú carga correctamente.

Notas:
- El interceptor HTTP agrega el header `Authorization: Bearer <token>` usando `accessToken` o `tempToken`.
- En caso de 401 el interceptor limpia la sesión y redirige a `/login`.

# Despliegue de la aplicación en Kubernetes

## 1. Requisitos

- Minikube ejecutándose
- kubectl instalado y configurado
- Docker disponible para construir imágenes locales

## 2. Construcción de imágenes

Desde la raíz del proyecto ejecuta:

```powershell
docker build -t master-service:latest ./backend/master-service
docker build -t api-gateway:latest ./backend/api-gateway
docker build -t reservations-service:latest ./backend/reservations-service
docker build -t erp-web:latest ./frontend/erp-web
```

Luego carga las imágenes en Minikube:

```powershell
minikube image load master-service:latest
minikube image load api-gateway:latest
minikube image load reservations-service:latest
minikube image load erp-web:latest
```

## 3. Despliegue

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend/master-service.yaml
kubectl apply -f k8s/backend/api-gateway.yaml
kubectl apply -f k8s/backend/reservations-service.yaml
kubectl apply -f k8s/frontend/erp-web.yaml
```

## 4. Verificación

```powershell
kubectl get pods -n parcial3
kubectl get svc -n parcial3
```

## 5. Acceso

- API Gateway: http://localhost:30005
- Frontend: http://localhost:30080

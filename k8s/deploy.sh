#!/usr/bin/env bash
set -e

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend/master-service.yaml
kubectl apply -f k8s/backend/api-gateway.yaml
kubectl apply -f k8s/backend/reservations-service.yaml
kubectl apply -f k8s/frontend/erp-web.yaml

echo "Despliegue aplicado."
echo "Verifica con: kubectl get pods -n parcial3"

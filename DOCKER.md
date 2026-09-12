# Docker Setup

Este proyecto incluye configuración Docker completa para containerizar el frontend.

## Archivos

- **Dockerfile**: Multi-stage build (Node → Nginx)
- **docker-compose.yml**: Orquestación de servicios
- **nginx.conf**: Configuración para SPA (React Router)
- **.dockerignore**: Archivos excluidos del build

## Requisitos

- Docker >= 28.0
- docker-compose (incluido en Docker Desktop)

## Uso

### Build image
```bash
docker compose build
```

### Iniciar servicio
```bash
docker compose up -d
```

Acceder: http://localhost

### Ver logs
```bash
docker compose logs -f frontend
```

### Detener
```bash
docker compose down
```

## Cómo funciona

1. **Build stage**: Instala deps con `npm ci`, compila TypeScript y bundlea con Vite
2. **Runtime stage**: Nginx sirve `dist/` en puerto 80
3. **SPA routing**: `nginx.conf` redirige requests a `index.html` para React Router
4. **Cache**: Assets estáticos (js, css, imágenes) se cachean 1 año. index.html no se cachea.

## Healthcheck

Servicio valida salud cada 30s con `wget http://localhost/`

## Permisos

Si obtienes "permission denied" con docker:

```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
# Recargar grupos
newgrp docker
```

O usa `sudo`:
```bash
sudo docker compose up -d
```

# 🐺 Nodo Manada Dashboard

<p align="center">
  <img src="dashboard/client/images/logo-lobo.png" alt="Logo Nodo Manada" width="180">
</p>

<p align="center">
  <em>Dashboard soberano para monitorear y aprender desde tu nodo Bitcoin Core</em>
</p>

## Resumen

Nodo Manada Dashboard es un panel ligero y autónomo para consultar un nodo Bitcoin Core mediante RPC. Proporciona una vista compacta con tarjetas informativas y una consola de inspección para desarrolladores y operadores locales.

Este README está orientado a usuarios que quieren instalar y ejecutar el dashboard localmente de forma segura.

Este proyecto nació como parte de una capacitación técnica y evolucionó hacia una herramienta real para entender qué está haciendo tu nodo, sin depender de terceros.
---
### 🧠 No es un explorador público. 🔒 No expone datos a internet. 🐺 Todo corre en tu máquina.
---
## ✨ Qué es (y qué no es) 

### Es:

Un panel local conectado a tu propio Bitcoin Core

Una forma visual de entender:

bloques

sincronización

mempool

conexiones

hashrate estimado

Una base sólida para seguir explorando wallets (ej: Sparrow)

---
### No es:

Una wallet

Un explorador tipo Etherscan

Una herramienta para controlar o minar Bitcoin

Un servicio en la nube

---
## Uso del dashboard

Al abrir el navegador verás:

Cards de estado

Último bloque

Conexiones

Dificultad

Uso de disco

Peso del bloque

Hora del bloque

Mempool

Hashrate estimado

Warnings

Estas métricas se actualizan automáticamente cada pocos segundos.

---
## Consola del nodo

El panel CONSOLE — BITCOIN NODE muestra información cruda del nodo en formato JSON, tal como la devuelve Bitcoin Core, pero ordenada y legible.

Sirve para:

inspección

aprendizaje

depuración

entender RPC “en vivo”

---
## Endpoints disponibles

El backend expone estos endpoints:

GET /api/status → getblockchaininfo

GET /api/lastblock → último bloque (header)

GET /api/connections → getnetworkinfo

GET /api/mempool → estado del mempool

GET /api/hashps → hashrate estimado

Todos se consumen solo localmente.
---
## Contenido

- [Requisitos](#requisitos)
- [Instalación rápida](#instalaci%C3%B3n-r%C3%A1pida)
- [Configuración RPC](#configuraci%C3%B3n-rpc)
- [Ejecutar el servidor](#ejecutar-el-servidor)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Uso del cliente](#uso-del-cliente)
- [API (endpoints)](#api-endpoints)
- [Seguridad y datos sensibles](#seguridad-y-datos-sensibles)
- [Desarrollo](#desarrollo)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Requisitos

- Bitcoin Core con RPC habilitado.
- Node.js (LTS recomendado) y npm.
- Navegador moderno (Chrome, Firefox, Edge, Safari).

Para desarrollo en Windows recomendamos PowerShell; en Linux/macOS, bash/zsh.

---

## Instalación rápida

1. Clona el repositorio:

```bash
git clone <repo-url>
cd nodo-manada-dashboard/dashboard
```

2. Instala dependencias:

```bash
npm install
```

3. Crea tu configuración RPC privada:

```bash
cp server/config.example.json server/config.json
# editar server/config.json con rpcuser/rpcpassword/rpcport
```

> Importante: no subas `server/config.json` a GitHub. Consulta la sección de seguridad más abajo.

---

## Configuración RPC

El servidor carga `dashboard/server/config.json` para conectar con Bitcoin Core. Formato mínimo:

```json
{
  "rpcuser": "usuario",
  "rpcpassword": "contraseña",
  "rpcport": 8332
}
```

Si el nodo está en otra máquina, ajusta la URL en `dashboard/server/rpc.js` o habilita el acceso remoto en tu nodo con cuidado.

---

## Ejecutar el servidor

Desde `dashboard/`:

```bash
npm run dev
```

Por defecto el servidor escucha en `http://localhost:3000`. Para usar otro puerto:

```bash
# Linux/macOS
PORT=3001 npm run dev

# Windows PowerShell
$env:PORT=3001; npm run dev
```

---

## Estructura del proyecto

- `dashboard/server/` — servidor Express y cliente RPC.
  - `index.js` — servidor principal.
  - `rpc.js` — wrapper para llamadas RPC.
  - `config.example.json` — plantilla de configuración (no contiene credenciales).
- `dashboard/client/` — frontend (estático): `index.html`, `app.js`, `style.css`, `images/`.
- `docs/`, `scripts/` — documentación y utilidades.

---

## Uso del cliente

Abre `http://localhost:3000` en tu navegador. El dashboard muestra tarjetas con información del nodo y una consola que presenta JSON crudo. Las tarjetas se actualizan periódicamente.

---

## API (endpoints)

- `GET /api/status` — `getblockchaininfo`.
- `GET /api/lastblock` — último bloque (header).
- `GET /api/connections` — `getnetworkinfo`.
- `GET /api/mempool` — `getmempoolinfo`.
- `GET /api/hashps` — `getnetworkhashps`.

Ejemplo rápido (curl):

```bash
curl http://localhost:3000/api/status
```

---

## Seguridad y datos sensibles

El dashboard requiere credenciales RPC; sigue estas buenas prácticas antes de publicar el repositorio:

- Añade `dashboard/server/config.json` a `.gitignore` (si no está ya):

```
dashboard/server/config.json
```

- Nunca subas credenciales al repo. Si ya lo hiciste:
  1. Rota/regenéra las credenciales en tu nodo.
  2. Elimina el archivo del índice y haz commit:

```bash
git rm --cached dashboard/server/config.json
git commit -m "chore: remove sensitive config"
git push
```

- Para eliminar secretos del historial usa `git filter-repo` o [`BFG Repo-Cleaner`](https://rtyley.github.io/bfg-repo-cleaner/), y rota credenciales.

---

## Desarrollo

- Para cambios en el frontend edita `dashboard/client/style.css` o `dashboard/client/app.js` y recarga el navegador.
- Opcional: usar `nodemon` para reinicio automático del servidor durante desarrollo (`npm install --save-dev nodemon`).

---

## Contribuir

1. Haz fork del repositorio.
2. Crea una rama descriptiva: `git checkout -b feat/mi-cambio`.
3. Envía commits atómicos y abre un PR con descripción clara.

---

## Licencia

Este proyecto se publica bajo la licencia MIT. Consulta `LICENSE` para los términos completos.

---

## Agradecimientos

Gracias a Joy y Karim por la capacitación y a la comunidad por las ideas.

<p align="center">
  <img src="dashboard/client/images/100nodos.png" alt="Proyecto 100 Nodos" width="220">
</p>
---
## Comunidad y más info en:
bitcoin.ar
https://bitcoinargentina.org/100-nodos-bitcoin/

---
### Construido por Daniela S. Tochi
### Asistencia técnica y conceptual: ChatGPT (OpenAI).

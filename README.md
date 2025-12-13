# nodo-manada-dashboard

![logo-lobo](dashboard/client/images/logo-lobo.png)

Nodo Manada Dashboard — Un dashboard liviano y soberano para visualizar y consultar tu nodo Bitcoin Core vía RPC.

Este README es una guía paso a paso para poner en marcha el proyecto localmente, configurar la conexión RPC y usar el cliente web incluido.

## Contenido

- Requisitos
- Instalación
- Configuración RPC (`server/config.json`)
- Ejecutar el servidor
- Estructura del proyecto
- Uso del cliente
- Resolución de problemas
- Agradecimientos y licencia

---

## Requisitos

- Bitcoin Core con RPC habilitado (versión recomendada: LTS actual).
- Node.js (LTS) y npm.
- Un navegador moderno para la interfaz web.

Si usas Windows, PowerShell funciona bien; en Linux/macOS usa bash.

---

## Instalación (rápida)

1. Clona el repositorio o descarga el código.

2. Entra a la carpeta del dashboard e instala dependencias:

```bash
cd dashboard
npm install
```

3. Copia `server/config.example.json` a `server/config.json` y rellena los datos RPC de tu nodo:

```json
{
 "rpcuser": "miusuario",
 "rpcpassword": "miclave",
 "rpcport": 8332
}
```

> Nota: `config.json` debe permanecer privado y no versionarse en git.

---

## Configuración RPC

Coloca el archivo `config.json` en `dashboard/server/config.json`. El servidor lo carga desde esa ubicación y lo usa para conectar con tu Bitcoin Core en `http://127.0.0.1:<rpcport>/`.

Ejemplo minímo (`dashboard/server/config.example.json`):

```json
{
 "rpcuser": "usuario",
 "rpcpassword": "contraseña",
 "rpcport": 8332
}
```

Si tu nodo está en otra máquina, modifica la URL en `server/rpc.js` o habilita el acceso remoto en tu nodo (con precaución).

---

## Ejecutar el servidor

Desde `dashboard/`:

```bash
npm run dev
```

Esto ejecuta el servidor Express en `http://localhost:3000` (por defecto). Si prefieres usar otro puerto:

```bash
PORT=3001 npm run dev
```

(En Windows PowerShell: `$env:PORT=3001; npm run dev`)

---

## Estructura del proyecto

- `dashboard/server/` — servidor Express y código RPC.
- `index.js` — servidor principal.
- `rpc.js` — cliente RPC que habla con Bitcoin Core.
- `config.json` — configuración local (no commitear).
- `dashboard/client/` — frontend estático (HTML/CSS/JS).
- `index.html`, `app.js`, `style.css`
- `images/logo-lobo.png`, `images/100nodos.png`
- `scripts/`, `docs/` — documentación y utilidades.

---

## Uso del cliente

1. Abre en tu navegador `http://localhost:3000`.
2. La página muestra varias tarjetas (`Último bloque`, `Dificultad`, `Conexiones`, etc.) que se actualizan periódicamente mediante fetch a los endpoints del servidor.
3. El panel de consola (`CONSOLE — BITCOIN NODE`) muestra datos crudos del nodo en JSON para inspección rápida.

### Endpoints disponibles (servidor)

- `GET /api/status` — información básica (`getblockchaininfo`).
- `GET /api/lastblock` — información del último bloque (header).
- `GET /api/connections` — información de red (`getnetworkinfo`).
- `GET /api/mempool` — info del mempool.
- `GET /api/hashps` — hashrate estimado.

---

## Personalizar apariencia

Los estilos están en `dashboard/client/style.css`. Puedes ajustar colores, tipografías y tamaños ahí. El logo principal está en `dashboard/client/images/logo-lobo.png`.

Si quieres probar contenidos largos (por ejemplo para `Dificultad`), el CSS ya está preparado para ajustar la altura automáticamente.

---

## Resolución de problemas comunes

- Error EADDRINUSE al iniciar: significa que el puerto 3000 está en uso. Para solucionarlo:
- Mata el proceso que usa el puerto o ejecuta en otro puerto: `PORT=3001 npm run dev`.

- `config.json` no encontrado: asegúrate de copiar `server/config.example.json` a `server/config.json`.

- No hay conexión RPC: revisa que Bitcoin Core esté corriendo con RPC habilitado y que `rpcuser`/`rpcpassword`/`rpcport` sean correctos.

---

## Seguridad y datos sensibles

Este proyecto requiere credenciales RPC para conectar con Bitcoin Core. Ten en cuenta las siguientes recomendaciones de seguridad antes de subir código a GitHub:

- Nunca subas `dashboard/server/config.json` (o cualquier archivo con credenciales) al repositorio.
- Añade una entrada en `.gitignore` para evitar subir archivos sensibles:

```
# Ignorar configuración privada del servidor
dashboard/server/config.json
```

- Si por error ya subiste `config.json` al repositorio remoto: elimina el archivo del índice, añade la entrada a `.gitignore`, realiza un commit y fuerza push, y rota las credenciales RPC inmediatamente.

Comandos básicos para eliminar el archivo del índice local y remoto:

```bash
git rm --cached dashboard/server/config.json
git commit -m "remove sensitive config"
git push
```

Si el secreto quedó publicado en el historial, usa herramientas como `git filter-repo` o `BFG Repo-Cleaner` para eliminarlo del historial, y vuelve a rotar las credenciales por seguridad.

---

## Desarrollo y pruebas

- El frontend hace fetch a los endpoints del servidor; para probar cambios, guarda los archivos y recarga el navegador.
- Si prefieres reinicio automático del servidor al guardar cambios, instala herramientas como `nodemon` (opcional):

```bash
cd dashboard
npm install --save-dev nodemon
# y cambiar el script dev a: nodemon server/index.js
```

---

## Agradecimientos

Gracias a la formación provista por Joy y Karim, y a la comunidad por inspirar este proyecto.

![100nodos](dashboard/client/images/100nodos.png)

---

## Contribuir

1. Haz fork del repo.
2. Crea una rama con tu feature: `git checkout -b feature/nombre`.
3. Haz commits claros y push.
4. Abre un pull request describiendo los cambios.

---

## Licencia

Este proyecto se publica bajo la licencia MIT. Consulta el archivo `LICENSE` incluido para los términos completos.

Si prefieres otra licencia para colaboraciones, indícalo en tu Pull Request.

---

Construido por la Manada. Con amor, técnica y soberanía. 🐺

// ====== ANIMACIÓN DE FONDO (estrellas) ======
const stars = 180; // equilibrado bonito + rendimiento
const container = document.body;

for (let i = 0; i < stars; i++) {
  let star = document.createElement("div");
  star.className = "star";
  star.style.left = Math.random() * 100 + "vw";
  star.style.top = Math.random() * 100 + "vh";
  star.style.animationDuration = 2 + Math.random() * 3 + "s";
  container.appendChild(star);
}

// ====== ELEMENTOS ======
const infoBox = document.getElementById("blockchain-data");
const blockHeightEl = document.getElementById("stat-block");
const connectionsEl = document.getElementById("stat-connections");
const diskUsageEl = document.getElementById("stat-disk");

let lastBlock = null; // para animación cuando sube

// ====== ESTADO DEL NODO ======
async function loadNodeStatus() {
  try {
    const res = await fetch("/api/status");
    const data = await res.json();

    if (data.error) {
      document.body.className = "error";
      infoBox.textContent = "⚠ Error RPC: no se pudo obtener estado.";
      return;
    }

    // Mostrar JSON completo
    infoBox.textContent = JSON.stringify(data, null, 2);

    // METRICAS
    const block = data.result.blocks;
    const diskGB = Math.round(data.result.size_on_disk / 1024 / 1024 / 1024);

    // Animación si hay nuevo bloque
    if (lastBlock !== null && block !== lastBlock) {
      animateBlockChange();
    }
    lastBlock = block;

    blockHeightEl.textContent = block;
    diskUsageEl.textContent = diskGB + " GB";

    // Estado visual del nodo
    if (data.result.initialblockdownload) {
      document.body.className = "sync";
    } else {
      document.body.className = "ok";
    }

  } catch (err) {
    document.body.className = "error";
    infoBox.textContent = "❌ Error conectando al backend.";
  }
}

// ====== ANIMACIÓN CUANDO SUBE EL BLOQUE ======
function animateBlockChange() {
  blockHeightEl.classList.add("pulse");
  setTimeout(() => blockHeightEl.classList.remove("pulse"), 800);
}

// ====== CONEXIONES ======
async function loadConnections() {
  try {
    const res = await fetch("/api/connections");
    const data = await res.json();

    if (data.error) {
      connectionsEl.textContent = "--";
      return;
    }

    connectionsEl.textContent = data.result.connections;

  } catch (err) {
    connectionsEl.textContent = "--";
  }
}

// ====== LOOP ======
function refresh() {
  loadNodeStatus();
  loadConnections();
}

refresh();
setInterval(refresh, 5000);

// ====== ANIMACIÓN DE FONDO (estrellas) ======
const stars = 120; // equilibrado: bonito + buen rendimiento
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

// Nuevas métricas
const diffEl = document.getElementById("stat-diff");
const weightEl = document.getElementById("stat-weight");
const timeEl = document.getElementById("stat-time");

// Para animación
let lastBlock = null;

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

    // Mostrar JSON en la card
    infoBox.textContent = JSON.stringify(data, null, 2);

    const block = data.result.blocks;
    const diskGB = Math.round(data.result.size_on_disk / 1024 / 1024 / 1024);

    // Animación si subió el bloque
    if (lastBlock !== null && block !== lastBlock) {
      animateBlockChange();
    }
    lastBlock = block;

    blockHeightEl.textContent = block;
    diskUsageEl.textContent = diskGB + " GB";

    // Estado del nodo: colores del fondo
    if (data.result.initialblockdownload) {
      document.body.className = "sync"; // Amarillo
    } else {
      document.body.className = "ok"; // Verde
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

  } catch {
    connectionsEl.textContent = "--";
  }
}

// ====== NUEVO: INFO DEL ÚLTIMO BLOQUE ======
async function loadLastBlock() {
  try {
    const res = await fetch("/api/lastblock");
    const data = await res.json();

    if (data.error) {
      diffEl.textContent = "--";
      weightEl.textContent = "--";
      timeEl.textContent = "--";
      return;
    }

    // Dificultad
    diffEl.textContent = Math.round(data.difficulty).toLocaleString();

    // Weight → kWU
    weightEl.textContent = (data.weight / 1000).toFixed(1) + " kWU";

    // Timestamp → hora local
    const date = new Date(data.time * 1000);
    timeEl.textContent = date.toLocaleTimeString();

  } catch (err) {
    diffEl.textContent = "--";
    weightEl.textContent = "--";
    timeEl.textContent = "--";
  }
}

// ====== LOOP ======
function refresh() {
  loadNodeStatus();
  loadConnections();
  loadLastBlock();
}

refresh();
setInterval(refresh, 5000);

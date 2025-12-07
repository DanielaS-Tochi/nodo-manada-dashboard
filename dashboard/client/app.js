// ====== ANIMACIÓN DE FONDO (estrellas) ======
const stars = 220;
const container = document.body;

for (let i = 0; i < stars; i++) {
  let star = document.createElement("div");
  star.className = "star";
  star.style.left = Math.random() * 100 + "vw";
  star.style.top = Math.random() * 100 + "vh";
  star.style.animationDuration = 2 + Math.random() * 3 + "s";
  container.appendChild(star);
}

// ====== ELEMENTOS DEL DOM ======
const infoBox = document.getElementById("blockchain-data");
const blockHeight = document.getElementById("stat-block");
const connectionsCount = document.getElementById("stat-connections");
const diskUsage = document.getElementById("stat-disk");

// ====== FUNCIÓN PARA CARGAR INFO DEL NODO ======
async function loadNodeStatus() {
  try {
    const res = await fetch("/api/status");
    const data = await res.json();

    if (data.error) {
      document.body.className = "error";
      infoBox.textContent = "⚠ Error RPC: no se pudo obtener estado.";
      return;
    }

    // JSON completo
    infoBox.textContent = JSON.stringify(data, null, 2);

    // Stats
    blockHeight.textContent = data.result.blocks;
    diskUsage.textContent =
      Math.round(data.result.size_on_disk / (1024 * 1024 * 1024)) + " GB";

    // Estado del nodo
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

// ====== FUNCIÓN PARA CARGAR CONEXIONES ======
async function loadConnections() {
  try {
    const res = await fetch("/api/connections");
    const data = await res.json();

    if (data.error) {
      connectionsCount.textContent = "--";
      return;
    }

    connectionsCount.textContent = data.result.connections;
  } catch (err) {
    connectionsCount.textContent = "--";
  }
}

// ====== LOOP ======
function refresh() {
  loadNodeStatus();
  loadConnections();
}

refresh();
setInterval(refresh, 5000);



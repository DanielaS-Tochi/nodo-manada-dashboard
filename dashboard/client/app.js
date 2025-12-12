/* =====================================================
   STARFIELD — fondo solamente, nunca sobre cards
===================================================== */
const STAR_COUNT = 150;
for (let i = 0; i < STAR_COUNT; i++) {
  const s = document.createElement("div");
  s.className = "star";
  s.style.left = Math.random() * 100 + "vw";
  s.style.top = Math.random() * 100 + "vh";
  s.style.animationDuration = (2 + Math.random() * 4) + "s";
  s.style.opacity = 0.15 + Math.random() * 0.55;
  s.style.zIndex = "-1";
  document.body.appendChild(s);
}

/* =====================================================
   ELEMENTS
===================================================== */
const infoBox = document.getElementById("blockchain-data");

const blockHeightEl = document.getElementById("stat-block");
const blockHashSmall = document.getElementById("stat-block-hash");

const connectionsEl = document.getElementById("stat-connections");
const diskUsageEl = document.getElementById("stat-disk");

const diffEl = document.getElementById("stat-diff");
const weightEl = document.getElementById("stat-weight");
const timeEl = document.getElementById("stat-time");

const hashpsEl = document.getElementById("stat-hashps");
const mempoolTxEl = document.getElementById("stat-mempool-tx");
const mempoolSizeEl = document.getElementById("stat-mempool-size");
const warningsEl = document.getElementById("stat-warnings");

const consoleStatus = document.getElementById("console-status");
const btnRefresh = document.getElementById("btn-refresh");

/* Safety: ensure missing elements don't break JS */
function safe(id) {
  return document.getElementById(id) || { textContent: "", style: {} };
}

/* =====================================================
   HELPERS
===================================================== */
async function rpcGet(path) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (e) {
    return { error: true, details: e };
  }
}

const toGB = bytes => Math.round((bytes || 0) / 1024 / 1024 / 1024);
const toKB = bytes => Math.round((bytes || 0) / 1024);

/* =====================================================
   LOADERS
===================================================== */
let lastBlock = null;

async function loadNodeStatus() {
  const data = await rpcGet("/api/status");

  if (data.error) {
    document.body.className = "error";
    infoBox.textContent = "⚠ Error RPC: no se pudo obtener estado.";
    consoleStatus.textContent = "RPC ERROR";
    return;
  }

  // Show pretty JSON
  infoBox.textContent = JSON.stringify(data, null, 2);

  const block = data.result.blocks;
  const bestHash = data.result.bestblockhash || "—";
  const diskGB = toGB(data.result.size_on_disk);

  // Animación cuando sube el bloque
  if (lastBlock !== null && block !== lastBlock) {
    animateBlockPulse();
  }
  lastBlock = block;

  blockHeightEl.textContent = block;
  blockHashSmall.textContent = "hash: " + bestHash;
  diskUsageEl.textContent = diskGB + " GB";

  // Estado visual del fondo
  if (data.result.initialblockdownload) {
    document.body.className = "sync";
  } else {
    document.body.className = "ok";
  }

  consoleStatus.textContent = "OK";
}

function animateBlockPulse() {
  blockHeightEl.classList.add("pulse");
  setTimeout(() => blockHeightEl.classList.remove("pulse"), 900);
}

async function loadConnections() {
  const data = await rpcGet("/api/connections");
  if (data.error) {
    connectionsEl.textContent = "--";
    return;
  }
  connectionsEl.textContent = data.result.connections ?? "--";
}

async function loadLastBlock() {
  const data = await rpcGet("/api/lastblock");

  if (data.error) {
    diffEl.textContent = "--";
    weightEl.textContent = "--";
    timeEl.textContent = "--";
    return;
  }

  diffEl.textContent = Math.round(data.difficulty).toLocaleString();
  weightEl.textContent = (data.weight / 1000).toFixed(1) + " kWU";
  timeEl.textContent = new Date(data.time * 1000).toLocaleTimeString();
  blockHashSmall.textContent = "hash: " + data.hash;
}

async function loadMempool() {
  const data = await rpcGet("/api/mempool");
  if (data.error || !data.result) {
    mempoolTxEl.textContent = "--";
    mempoolSizeEl.textContent = "--";
    return;
  }

  mempoolTxEl.textContent = data.result.size;
  mempoolSizeEl.textContent = toKB(data.result.bytes) + " KB";
}

async function loadHashrate() {
  const data = await rpcGet("/api/hashps");

  if (data.error || !data.result) {
    hashpsEl.textContent = "--";
    return;
  }

  const h = data.result.hashps ?? data.result;
  const th = h / 1e12;

  hashpsEl.textContent =
    th >= 0.01 ? th.toFixed(2) + " TH/s" : (h / 1e9).toFixed(2) + " GH/s";
}

async function loadWarnings() {
  const status = await rpcGet("/api/status");

  if (!status.error && status.result?.warnings?.length) {
    warningsEl.textContent = status.result.warnings.join(" | ");
    return;
  }

  warningsEl.textContent = "–";
}

/* =====================================================
   ORCHESTRATOR
===================================================== */
async function refreshAll() {
  await Promise.allSettled([
    loadNodeStatus(),
    loadConnections(),
    loadLastBlock(),
    loadMempool(),
    loadHashrate(),
    loadWarnings()
  ]);
}

refreshAll();
setInterval(refreshAll, 5000);

btnRefresh?.addEventListener("click", refreshAll);

/* =====================================================
   AUTO-SCROLL DEL TERMINAL
===================================================== */
const consoleBox = document.querySelector(".console-box");
let lastConsoleText = "";

if (consoleBox) {
  const obs = new MutationObserver(() => {
    if (consoleBox.innerText !== lastConsoleText) {
      consoleBox.scrollTop = consoleBox.scrollHeight;
      lastConsoleText = consoleBox.innerText;
    }
  });
  obs.observe(consoleBox, { childList: true, subtree: true, characterData: true });
}

console.log("🐺 Nodo Manada Dashboard — Client OK");

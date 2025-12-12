// ====== STARFIELD (solo fondo) ======
const stars = 160;
const container = document.body;
for (let i = 0; i < stars; i++) {
  const s = document.createElement("div");
  s.className = "star";
  s.style.left = Math.random() * 100 + "vw";
  s.style.top = Math.random() * 100 + "vh";
  s.style.animationDuration = (2 + Math.random() * 4) + "s";
  s.style.opacity = 0.12 + Math.random() * 0.6;
  s.style.zIndex = "-1"; // estrellas en fondo
  container.appendChild(s);
}

// ===== ELEMENTS =====
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

// ensure placeholders
function ensure(id) {
  const el = document.getElementById(id);
  if (el) return el;
  const fake = document.createElement('span'); fake.id = id; fake.style.display = 'none'; document.body.appendChild(fake); return fake;
}
ensure('stat-hashps'); ensure('stat-mempool-tx'); ensure('stat-mempool-size'); ensure('stat-warnings');

// ===== POLLING =====
let lastBlock = null;

// safe fetch helper
async function rpcGet(path) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (e) {
    return { error: true, details: e };
  }
}

// formatters
const toGB = bytes => Math.round((bytes || 0) / 1024 / 1024 / 1024);
const toKB = bytes => Math.round((bytes || 0) / 1024);

// LOADERS
async function loadNodeStatus(){
  const data = await rpcGet('/api/status');
  if (data.error) {
    document.body.className = 'error';
    if (infoBox) infoBox.textContent = '⚠ Error RPC: no se pudo obtener estado.';
    if (consoleStatus) consoleStatus.textContent = 'RPC ERROR';
    return;
  }

  if (infoBox) {
    try { infoBox.innerText = JSON.stringify(data, null, 2); } catch(e){ infoBox.textContent = "[error parsing]"; }
  }

  const block = data.result?.blocks ?? null;
  const bestHash = data.result?.bestblockhash ?? '-';
  const diskGB = toGB(data.result?.size_on_disk ?? 0);

  if (lastBlock !== null && block !== lastBlock) animateBlockPulse();
  lastBlock = block;

  if (blockHeightEl) blockHeightEl.textContent = block ?? '–';
  if (blockHashSmall) blockHashSmall.textContent = `hash: ${bestHash}`;
  if (diskUsageEl) diskUsageEl.textContent = diskGB + ' GB';

  if (consoleStatus) consoleStatus.textContent = 'OK';
  if (data.result?.initialblockdownload) document.body.className='sync'; else document.body.className='ok';
}

function animateBlockPulse(){
  if (!blockHeightEl) return;
  blockHeightEl.classList.add('pulse');
  setTimeout(()=> blockHeightEl.classList.remove('pulse'), 900);
}

async function loadConnections(){
  const data = await rpcGet('/api/connections');
  if (data.error) { if (connectionsEl) connectionsEl.textContent = '--'; return; }
  if (connectionsEl) connectionsEl.textContent = data.result?.connections ?? '--';
}

async function loadLastBlock(){
  const data = await rpcGet('/api/lastblock');
  if (data.error) {
    if (diffEl) diffEl.textContent = '--';
    if (weightEl) weightEl.textContent = '--';
    if (timeEl) timeEl.textContent = '--';
    return;
  }
  if (diffEl) diffEl.textContent = (Math.round(data.difficulty)).toLocaleString();
  if (weightEl) weightEl.textContent = (data.weight/1000).toFixed(1) + ' kWU';
  if (timeEl) timeEl.textContent = new Date((data.time||0)*1000).toLocaleTimeString();
  if (blockHashSmall) blockHashSmall.textContent = 'hash: ' + (data.hash ?? '-');
}

async function loadMempool(){
  const data = await rpcGet('/api/mempool');
  if (data.error || !data.result) {
    if (mempoolTxEl) mempoolTxEl.textContent = '--';
    if (mempoolSizeEl) mempoolSizeEl.textContent = '--';
    return;
  }
  if (mempoolTxEl) mempoolTxEl.textContent = data.result.size ?? '--';
  if (mempoolSizeEl) mempoolSizeEl.textContent = toKB(data.result.bytes || 0) + ' KB';
}

async function loadHashrate(){
  const data = await rpcGet('/api/hashps');
  if (data.error || !data.result) {
    if (hashpsEl) hashpsEl.textContent = '--';
    return;
  }
  const h = data.result.hashps ?? data.result;
  const th = (h/1e12);
  if (hashpsEl) hashpsEl.textContent = (th >= 0.01) ? th.toFixed(2) + ' TH/s' : (h/1e9).toFixed(2) + ' GH/s';
}

async function loadWarnings(){
  const s = await rpcGet('/api/status');
  if (!s.error && s.result && s.result.warnings && s.result.warnings.length) {
    if (warningsEl) warningsEl.textContent = s.result.warnings.join(' ; ');
    return;
  }
  if (warningsEl) warningsEl.textContent = '–';
}

// orchestrator
async function refreshAll(){
  await Promise.allSettled([
    loadNodeStatus(),
    loadConnections(),
    loadLastBlock(),
    loadMempool(),
    loadHashrate(),
    loadWarnings()
  ]);
}

// refresh loop and manual refresh
refreshAll();
setInterval(refreshAll, 5000);
btnRefresh?.addEventListener('click', refreshAll);

// auto-scroll console on update
let lastConsoleText = '';
const consoleBox = document.querySelector('.console-box');
const obs = new MutationObserver(()=> {
  if (!consoleBox) return;
  if (consoleBox.innerText !== lastConsoleText) {
    consoleBox.scrollTop = consoleBox.scrollHeight;
    lastConsoleText = consoleBox.innerText;
  }
});
if (consoleBox) obs.observe(consoleBox, { childList: true, subtree: true, characterData: true });

console.log("Nodo Manada Dashboard client inicializado (v1)");


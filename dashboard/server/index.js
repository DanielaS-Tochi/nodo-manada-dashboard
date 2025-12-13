import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { rpc } from "./rpc.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Cargar config.json desde /server
let config;
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")));
  console.log("✅ config.json cargado correctamente");
} catch (e) {
  console.error("❌ ERROR: No se pudo cargar config.json desde /server");
  console.error("Ruta buscada:", path.join(__dirname, "config.json"));
  process.exit(1);
}

// Servir estáticos
app.use(express.static(path.join(__dirname, "../client")));

// ENDPOINT: estado básico del nodo
app.get("/api/status", async (req, res) => {
  try {
    const info = await rpc("getblockchaininfo");
    res.json(info);
  } catch (err) {
    res.status(500).json({
      error: "Error consultando RPC getblockchaininfo",
      details: err && err.message ? err.message : err
    });
  }
});

// ENDPOINT: conexiones de red
app.get("/api/connections", async (req, res) => {
  try {
    const info = await rpc("getnetworkinfo");
    res.json(info);
  } catch (err) {
    res.status(500).json({
      error: "Error consultando RPC getnetworkinfo",
      details: err && err.message ? err.message : err
    });
  }
});

// ENDPOINT: último bloque (header)
app.get("/api/lastblock", async (req, res) => {
  try {
    const chain = await rpc("getblockchaininfo");
    const hash = chain.result.bestblockhash;
    const header = await rpc("getblockheader", [hash]);

    res.json({
      hash,
      height: chain.result.blocks,
      time: header.result.time,
      difficulty: header.result.difficulty,
      weight: header.result.weight
    });
  } catch (err) {
    res.status(500).json({
      error: "Error consultando último bloque",
      details: err && err.message ? err.message : err
    });
  }
});

// ENDPOINT: mempool info
app.get("/api/mempool", async (req, res) => {
  try {
    const info = await rpc("getmempoolinfo");
    res.json({ result: info.result });
  } catch (err) {
    res.status(500).json({
      error: "Error consultando mempool",
      details: err && err.message ? err.message : err
    });
  }
});

// ENDPOINT: hashrate (getnetworkhashps)
app.get("/api/hashps", async (req, res) => {
  try {
    const r = await rpc("getnetworkhashps");
    res.json({ result: { hashps: r.result } });
  } catch (err) {
    res.status(500).json({
      error: "Error consultando hashrate",
      details: err && err.message ? err.message : err
    });
  }
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🐺 Nodo Manada Dashboard → http://localhost:${PORT}`);
});

// Manejar errores de arranque (p. ej. puerto en uso) de forma limpia
server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(`❌ Error: puerto ${PORT} en uso. Terminando para reinicio.`);
    process.exit(1);
  }
  console.error("Server error:", err);
  process.exit(1);
});

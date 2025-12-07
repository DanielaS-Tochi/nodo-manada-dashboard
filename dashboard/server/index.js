import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { rpc } from "./rpc.js";

// Necesario para rutas absolutas en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// 🚨 Cargar SIEMPRE config.json desde /server
let config;
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")));
  console.log("✅ config.json cargado correctamente");
} catch (e) {
  console.error("❌ ERROR: No se pudo cargar config.json desde /server");
  console.error("Ruta buscada:", path.join(__dirname, "config.json"));
  process.exit(1);
}

// Sirve archivos estáticos del cliente
app.use(express.static(path.join(__dirname, "../client")));

// ===== ENDPOINT 1: Estado del nodo =====
app.get("/api/status", async (req, res) => {
  try {
    const info = await rpc("getblockchaininfo");
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: "Error consultando RPC", details: err });
  }
});

// ===== ENDPOINT 2: Conexiones de red =====
app.get("/api/connections", async (req, res) => {
  try {
    const info = await rpc("getnetworkinfo");
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: "Error consultando RPC", details: err });
  }
});

// Inicia servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🐺 Nodo Manada Dashboard → http://localhost:${PORT}`);
});


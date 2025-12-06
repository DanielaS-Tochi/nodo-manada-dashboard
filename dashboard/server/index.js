import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { rpc } from "./rpc.js";

// Necesario para rutas absolutas en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Sirve archivos estáticos del cliente
app.use(express.static(path.join(__dirname, "../client")));

// Endpoint: estado básico del nodo
app.get("/api/status", async (req, res) => {
  try {
    const info = await rpc("getblockchaininfo");
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

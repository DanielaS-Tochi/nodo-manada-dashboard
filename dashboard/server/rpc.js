import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Rutas absolutas para ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🚨 Cargar config.json SIEMPRE desde /server
let config;
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")));
} catch (e) {
  console.error("❌ No se encontró config.json en /server");
  process.exit(1);
}

export async function rpc(method, params = []) {
  const body = {
    jsonrpc: "1.0",
    id: "nodo-manada",
    method,
    params,
  };

  const response = await fetch(`http://127.0.0.1:${config.rpcport}/`, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(config.rpcuser + ":" + config.rpcpassword).toString("base64"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

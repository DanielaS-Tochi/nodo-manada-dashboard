import fetch from "node-fetch";
import fs from "fs";

// Carga config.json (el usuario deberá copiar config.example.json y renombrarlo)
let config;
try {
  config = JSON.parse(fs.readFileSync("./config.json"));
} catch (e) {
  console.error("❌ No se encontró config.json. Copiá config.example.json.");
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

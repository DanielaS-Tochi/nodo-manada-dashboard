async function cargarDatos() {
  try {
    const res = await fetch("/api/status");
    const data = await res.json();

    const box = document.getElementById("blockchain-data");
    box.textContent = JSON.stringify(data.result, null, 2);

  } catch (err) {
    document.getElementById("blockchain-data").textContent =
      "Error conectando con el nodo ❌";
  }
}

// carga inicial
cargarDatos();

// refresco cada 10 segundos
setInterval(cargarDatos, 10000);

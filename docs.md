# 🧭 Nodo Manada — Plan de Vuelo (v1)

Este documento acompaña al **Nodo Manada Dashboard** y tiene como objetivo
explicar, paso a paso y con lenguaje claro, **qué datos estamos viendo**, 
**de dónde salen** y **para qué sirven**.

No es documentación avanzada.
Es una guía para aprender mirando tu propio nodo.

---

## 🎯 Objetivo de esta v1

En la versión 1 del proyecto buscamos:

- Conectar correctamente con un nodo Bitcoin Core vía RPC
- Visualizar información real del nodo
- Entender conceptos clave del funcionamiento de Bitcoin
- Construir una base sólida para explorar wallets como Sparrow

---

## 🧩 Qué información muestra el dashboard (y qué significa)

### ⛓️ Último bloque
Muestra la altura del último bloque conocido por tu nodo.

- Si aumenta: tu nodo está sincronizado y recibiendo nuevos bloques
- Si no cambia: puede estar detenido o desconectado

El hash mostrado identifica de forma única ese bloque.

---

### 🔗 Conexiones
Cantidad de peers conectados a tu nodo.

- Más conexiones = mejor propagación
- Muy pocas conexiones pueden indicar problemas de red

---

### 📦 Uso de disco
Espacio que ocupa la blockchain en tu máquina.

- Si el nodo está en modo **pruned**, este valor será menor
- Aun así, el nodo sigue siendo válido

---

### 🧮 Dificultad
La dificultad actual de minería de la red.

- Ajusta aproximadamente cada 2016 bloques
- Refleja cuán difícil es minar un bloque nuevo

---

### ⚖️ Peso del bloque
Peso del último bloque (kWU).

- Indica cuántas transacciones entraron
- Tiene relación con el uso de SegWit

---

### 🕒 Hora del bloque
Timestamp del último bloque, convertido a tu hora local.

Sirve para ver:
- ritmo de la red
- posibles desvíos de tiempo

---

### 📬 Mempool
Información sobre transacciones pendientes:

- Cantidad de transacciones
- Tamaño total en KB

Si el mempool crece:
- hay congestión
- las fees tienden a subir

---

### ⚡ Hashrate estimado
Estimación del poder de cómputo de la red.

- No es exacto
- Sirve para tener una referencia del estado general de la red

---

### ⚠️ Warnings
Advertencias del nodo.

- Pueden estar vacías
- Si aparecen, conviene leerlas con atención

---

## 🖥️ La consola del nodo

La consola muestra información cruda en formato JSON proveniente del RPC.

Aquí podés ver:
- estado interno del nodo
- progreso de verificación
- parámetros que no están en las cards

No es necesario entender todo.
Está para **explorar y aprender**.

---

## 🔌 De dónde salen los datos

Todos los datos provienen de llamadas RPC estándar de Bitcoin Core, como:

- `getblockchaininfo`
- `getnetworkinfo`
- `getblockheader`
- `getmempoolinfo`

Nada se consulta a servicios externos.

---

## 🔐 Soberanía y privacidad

- El dashboard corre localmente
- No expone datos a internet
- No comparte información con terceros

Tu nodo, tus reglas.

---

## 🧠 Qué sabemos al cerrar la v1

Al finalizar esta versión:

- Sabemos que el nodo funciona
- Entendemos qué hace y qué ve
- Podemos leer su estado
- Tenemos una base técnica real

---

## 🧭 Próximo destino (v2)

Con este conocimiento, el siguiente paso natural es:

- Conectar una wallet a nuestro nodo
- Explorar Sparrow Wallet
- Ver cómo una wallet usa el nodo que ya entendemos

Sin apuro.
Con criterio.
Con soberanía.

---

Este documento fue elaborado como parte del proyecto Nodo Manada, con apoyo de ChatGPT (OpenAI) para la estructuración conceptual y pedagógica.
 
Aprendiendo bloque a bloque. 🐺

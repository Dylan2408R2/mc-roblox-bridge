const mineflayer = require('mineflayer');
const axios = require('axios');

// Genera un ID único para tu sesión (ejemplo: JugadoresCraft123)
const SESSION_ID = "JugadoresCraft_Secret_Key_99"; 
const STORAGE_URL = `https://keyvalue.xyz/v1/${SESSION_ID}`;

const bot = mineflayer.createBot({
  host: 'JugadoresCraft.aternos.me',
  username: 'BridgeBot',
  version: false
});

bot.on('physicTick', async () => {
  let players = {};
  for (const name in bot.entities) {
    const e = bot.entities[name];
    if (e.type === 'player') {
      players[e.username] = { x: e.position.x, y: e.position.y, z: e.position.z };
    }
  }
  
  // Enviamos los datos al almacén gratuito
  try {
    await axios.post(STORAGE_URL, players);
  } catch (e) { /* Error silencioso para no llenar la consola */ }
});

// Anti-AFK
setInterval(() => { bot.setControlState('jump', true); setTimeout(()=>bot.setControlState('jump', false), 500); }, 20000);
console.log("Puente Iniciado...");

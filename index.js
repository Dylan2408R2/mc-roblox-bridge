const mineflayer = require('mineflayer');
const axios = require('axios');

const TUNNEL_ID = "JugadoresCraft_121687828054151"; // Basado en tu ID de juego
const URL = `https://keyvalue.xyz/v1/${TUNNEL_ID}`;

const bot = mineflayer.createBot({
    host: 'JugadoresCraft.aternos.me',
    username: 'CrossplayBot',
    version: false
});

let mcData = { players: {}, blocks: [] };

// Al entrar, ir a la zona de spawn de Roblox
bot.on('spawn', () => {
    console.log("Bot en posición. Esperando jugadores...");
});

// BUCLE PRINCIPAL: Sincronización
setInterval(async () => {
    // 1. Obtener datos de Minecraft (Jugadores y sus Skins)
    for (const name in bot.entities) {
        const e = bot.entities[name];
        if (e.type === 'player') {
            mcData.players[e.username] = {
                x: e.position.x, y: e.position.y, z: e.position.z,
                skin: `https://minotar.net/armor/body/${e.username}/100.png`
            };
        }
    }

    // 2. Enviar datos de MC y recibir datos de ROBLOX
    try {
        const res = await axios.post(URL, mcData);
        const robloxPlayers = res.data.robloxPlayers || {};

        // 3. Hacer que los de ROBLOX aparezcan en MC (0, 81, 8)
        for (const user in robloxPlayers) {
            const rbPos = robloxPlayers[user];
            // Usamos el chat para emular a los jugadores de Roblox como NPCs o Teletransporte
            // Requiere que el bot sea OP: /op CrossplayBot
            bot.chat(`/execute at ${bot.username} run particle dust 0 1 0 1 ${rbPos.x} ${rbPos.y} ${rbPos.z} 0.1 0.1 0.1 0 5`);
            
            // Aplicar Skin de NameMC (Requiere plugin SkinsRestorer en Aternos)
            if (rbPos.skinName) {
                bot.chat(`/skin set ${user} ${rbPos.skinName}`);
            }
        }
    } catch (e) {}
}, 500);

// Anti-AFK
setInterval(() => { bot.setControlState('jump', true); setTimeout(()=>bot.setControlState('jump', false), 500); }, 15000);

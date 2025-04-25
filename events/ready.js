const { Events, MessageFlags } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ ${client.user.tag} is online!`);
        client.user.setActivity('with your heart', { type: 'PLAYING' });
        client.user.setStatus('online');
    }
      
};

// module.exports = {
//     name: 'playerEmpty',
//     async execute(client, player) {
//         if(player.data.get("autoplay")){
//             const requester = player.date.get("requester")
//             const identifier = player.data.get("identifier")
//             const search = 
//         }
//     }

// };

const { EmbedBuilder } = require("discord.js")
const e = require("express")
//when queue is becomes empty
module.exports = {
    name: 'playerEmpty',
    async execute(client, player) {
        const embed = new EmbedBuilder()
        const textChannel = client.channels.cache.get(player.textId);

        if (!textChannel) return;

        if (player.data.get("stay")) return;
        embed
            .setTitle("Queue Ended")
            .setDescription("🛑 There are no more songs in the queue")
            .setColor('Random')
        await textChannel.send({ embeds: [embed] })

        player.destroy();
    }
}
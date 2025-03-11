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

module.exports = {
    name: 'playerEmpty',
    async execute(client, player) {
        console.log("Queue ended")
        // if (!player || !player.textId) {
        //     console.log("Player not found")
        //     return;
        // }

        // const channel = client.channels.cache.get(player.textId);
        // if (!channel) {
        //     console.log("Channel not found")
        //     return;
        // }

        // if (player.data.get("stay")) return;

        // const embed = new EmbedBuilder()
        //     .setColor('Random')
        //     .setTimestamp("Ended")
        //     .setDescription("The queue has ended and is empty.")
        //     .setFooter({ text: "Thanks for listening!" });

        // await channel.send({ embeds: [embed] });
        // player.destroy();
    }   
    
        


}
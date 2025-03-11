const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "playerEnd",

    async execute(client, player) {

        console.log("Track ended")
        // try {
        //     const textChannel = client.channels.cache.get(player.textId);
        //     if (!textChannel) return;

        //     const embed = new EmbedBuilder()
        //         .setTitle("Queue Ended")
        //         .setDescription("Queue has ended. Thanks for listening!")
        //         .setColor('Random')
        //         .setFooter({ text: "Powered by DesQ Pogi" });

        //     await textChannel.send({ embeds: [embed] });

        //     player.destroy();

        // } catch (error) {
        //     console.error(error);
        // }
    }
}
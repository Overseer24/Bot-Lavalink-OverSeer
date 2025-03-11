const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "playerMoved",

    async execute(player, state, channels, client) {

        try {
            // console.log("Player:", player);
            // console.log("Player moved:", state);
            // console.log("Channels:", channels);
            const textChannel = client.channels.cache.get(player.textId);
            if (state === "LEFT") {
                const embed = new EmbedBuilder()
                    .setTitle("Player Disconnected")
                    .setDescription("Bat mo naman yon ginawa?")
                    .setColor('Random')
                    .setFooter({ text: "Powered by DesQ Pogi" });



                await textChannel.send({ embeds: [embed] });

                player.destroy();


            }
        } catch (error) {
            console.error(error);
        }

    }

}
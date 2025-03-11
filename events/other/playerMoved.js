const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "playerMoved",

    async execute(player, state, channels, client) {

        try {
          
            const textChannel = client.channels.cache.get(player.textId);
            const embed = new EmbedBuilder()
            if (!textChannel) return;
            if (state === "LEFT") {
                if (!client.channels.cache.has(player.voiceId)) {
                    return;
                }
                embed
                    .setTitle("Player Disconnected")
                    .setDescription("Bat mo naman yon ginawa?")
                    .setColor('Random')
                    .setFooter({ text: "Powered by DesQ Pogi" });

                player.pause(true)
                player.disconnect();

                await textChannel.send({ embeds: [embed] });
            }

            else if (state === "MOVED") {
                embed
                    .setTitle("Moved to new channel")
                    .setDescription(`Moved to <#${channels.newChannelId}>`)
                    .setColor('Random')
                 

                // player.voiceId = channels.newChannelId;
                await textChannel.send({ embeds: [embed] });
            }


        } catch (error) {
            console.error(error);
        }

    }

}
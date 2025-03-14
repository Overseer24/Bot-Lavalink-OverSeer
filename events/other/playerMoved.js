const { EmbedBuilder } = require("discord.js")
const { clearNowPlayingMessage } = require("../../utils/clearNowPlayingMessage");
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

                player.pause(true)
                player.disconnect();
                // const messageId = client.nowPlayingMessages.get(player.guildId);
                // if (messageId) {
                //     try {
                //         const nowPlayingMessage = await textChannel.messages.fetch(messageId);
                //         await nowPlayingMessage.delete();
                //         client.nowPlayingMessages.delete(player.guildId);
                //     } catch (error) {
                //         console.error("Failed to delete Now Playing message:", error);
                //     }
                // }
                await clearNowPlayingMessage(client, player.guildId, player);

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
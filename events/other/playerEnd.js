const { EmbedBuilder } = require("discord.js")
const { clearNowPlayingMessage } = require("../../utils/clearNowPlayingMessage");
module.exports = {
    name: "playerEnd",

    async execute(client, player) {

        console.log("Track ended")
        //delete the old playStart embed
        try {
            // const textChannel = client.channels.cache.get(player.textId);
            // if (!textChannel) return;
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
        } catch (e) {
            console.log("Could not delete the now playing message")

        }

    }
}
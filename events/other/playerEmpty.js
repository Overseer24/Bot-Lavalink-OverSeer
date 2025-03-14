

const { EmbedBuilder } = require("discord.js")
const e = require("express")
const { clearNowPlayingMessage } = require("../../utils/clearNowPlayingMessage");
//when queue is becomes empty
module.exports = {
    name: 'playerEmpty',
    async execute(client, player) {
        const embed = new EmbedBuilder()
        const textChannel = client.channels.cache.get(player.textId);
        if (!textChannel) return;

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
        if (player.data.get("stay")) return;
        embed
            .setTitle("Queue Ended")
            .setDescription("🛑 There are no more songs in the queue")
            .setColor('Random')
        await textChannel.send({ embeds: [embed] })

        player.destroy();
    }
}
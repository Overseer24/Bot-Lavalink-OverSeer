const { queueButtons } = require("./queueButtonsComponent.js");
const { formatDuration } = require("./durationFormatter.js");
const { EmbedBuilder } = require("discord.js");

async function updateQueueMessage(client, guildId, player) {
    const guildQueueMessage = client.queueMessages.get(guildId);
    if (!guildQueueMessage) return; // Don't update if no queue message exists

    const textChannel = client.channels.cache.get(player.textId);
    if (!textChannel) return;

    try {
        const message = await textChannel.messages.fetch(guildQueueMessage);
        if (!message) return; // Message might have been deleted


        const queue = player.queue;
        const page = (message.embeds[0]?.footer?.text?.match(/\d+/g) || [1, 1]).map(Number);
        const [currentPage, totalPages] = page;
        const startIndex = (currentPage - 1) * 10
        const tracks = queue.slice(startIndex, startIndex + 10);
        const tracksString = tracks
            .map((track, index) => `${startIndex + index + 1}. [${track.title}](${track.uri}) - ${formatDuration(track.length)}`)
            .join("\n");

        const embed = new EmbedBuilder()
            .setTitle("Queue")
            .setDescription(`**Now Playing:** [${queue.current.title}](${queue.current.uri}) - \`${formatDuration(queue.current.length)}\`\n\n${tracksString || "No more songs!"}`)
            .setColor("Blue")
            .setThumbnail(player.queue.current.thumbnail)

        //if queue less than 10
        if (queue.length <= 10) {
            embed.setFooter({ text: `Page 1 of 1` });
        }
        // Edit the existing queue message
        await message.edit({ embeds: [embed], components: [queueButtons(currentPage, totalPages)] });

    } catch (error) {
        console.error("Failed to update queue message:", error);
    }
}

module.exports = { updateQueueMessage };

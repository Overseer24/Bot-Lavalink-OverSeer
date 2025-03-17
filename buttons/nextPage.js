const { EmbedBuilder, MessageFlags } = require("discord.js");
const { queueButtons } = require("../utils/queueButtonsComponent.js");
const { formatDuration } = require("../utils/durationFormatter.js");

module.exports = {
    customId: "nextPage",
    async execute(interaction, client) {
        const embed = new EmbedBuilder();
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: "❌ No player found!", ephemeral: true });


        const page = (interaction.message.embeds[0]?.footer?.text?.match(/\d+/g) || [1, 1]).map(Number);
        console.log(page);
        const [currentPage, totalPages] = page;
        if (currentPage >= totalPages) return interaction.deferUpdate();
        const queue = player.queue;
        const startIndex = (currentPage) * 10; // 0, 10, 20, 30, 40, 50, 60, 70, 80, 90
        console.log("Next Start Index: ",startIndex , "to", startIndex + 10);
        const tracks = queue.slice(startIndex, startIndex + 10);
        const tracksString = tracks.map((track, index) => `${startIndex + index + 1}. [${track.title}](${track.uri}) - ${formatDuration(track.length)}`).join("\n");

        embed
            .setTitle("Queue")
            .setDescription(`**Now Playing:** [${queue.current.title}](${queue.current.uri}) - \`${formatDuration(queue.current.length)}\`\n\n${tracksString || "No more songs!"}`)
            .setColor("Blue")
            .setThumbnail(player.queue.current.thumbnail)
            .setFooter({ text: `Page ${currentPage + 1} of ${totalPages}` });

        // Delete previous queue message

        const guildQueueMessage = client.queueMessages.get(interaction.guild.id);

        const textChannel = client.channels.cache.get(player.textId);


        if (!textChannel) return;
        if (guildQueueMessage) {
            try {
                const message = await textChannel.messages.fetch(guildQueueMessage);
          
                if (message) await message.delete();
                client.queueMessages.delete(interaction.guild.id);
            } catch (error) {
                console.error("Failed to delete old queue message:", error);
            }
        }

        // Send new queue message and store its ID
        const newQueueMessage = await interaction.channel.send({ embeds: [embed], components: [queueButtons(currentPage + 1, totalPages)] });
        client.queueMessages.set(interaction.guild.id, newQueueMessage.id);

        return interaction.deferUpdate();
    }
}
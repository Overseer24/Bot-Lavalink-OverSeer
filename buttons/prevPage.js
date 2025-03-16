const { EmbedBuilder } = require("discord.js");
const { queueButtons } = require("../utils/queueButtonsComponent.js");
const { formatDuration } = require("../utils/durationFormatter.js");

module.exports = {
    customId: "previousPage",
    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        if (!player) return interaction.reply({ content: "❌ No player found!", ephemeral: true });

        const queue = player.queue;
        const page = (interaction.message.embeds[0]?.footer?.text?.match(/\d+/g) || [1, 1]).map(Number);
        console.log(page);
        const [currentPage, totalPages] = page;

        if (currentPage <= 1) return interaction.deferUpdate();

        const startIndex = (currentPage - 2) * 10;
        const tracks = queue.slice(startIndex, startIndex + 10);
        const tracksString = tracks.map((track, index) => `${startIndex + index + 1}. [${track.title}](${track.uri}) - ${formatDuration(track.length)}`).join("\n");
        
        
        const embed = new EmbedBuilder()
            .setTitle("Queue")
            .setDescription(`**Now Playing:** [${queue.current.title}](${queue.current.uri}) - \`${formatDuration(queue.current.length)}\`\n\n${tracksString || "No more songs!"}`)
            .setColor("Blue")
            .setThumbnail(queue.current.thumbnail)
            .setFooter({ text: `Page ${currentPage - 1} of ${totalPages}` });

        // Delete previous queue message
        const guildQueueMessage = client.queueMessages.get(interaction.guild.id);
        if (guildQueueMessage) {
            try {
                const oldMessage = await interaction.channel.messages.fetch(guildQueueMessage);
                if (oldMessage) await oldMessage.delete();
            } catch (error) {
                console.error("Failed to delete old queue message:", error);
            }
        }

        // Send new queue message and store its ID
        const newQueueMessage = await interaction.channel.send({ embeds: [embed], components: [queueButtons(currentPage - 1, totalPages)] });
        client.queueMessages.set(interaction.guild.id, newQueueMessage.id);

        return interaction.deferUpdate();
    },
};

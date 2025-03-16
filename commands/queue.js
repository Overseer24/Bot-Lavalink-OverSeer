const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { data } = require("./skip");
const { formatDuration } = require("../utils/durationFormatter.js");
const { queueButtons } = require("../utils/queueButtonsComponent.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the current queue"),
    async execute(interaction, client) {
        const embed = new EmbedBuilder();
        const player = client.manager.players.get(interaction.guild.id);

        if (!player) {
            embed
                .setTitle("Error")
                .setDescription("❌ Nothing is playing right now")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] });
        }



        try {
            const queue = player.queue;
            const current = queue.current;

            if (queue.length === 0 && !current) {
                embed
                    .setTitle("Queue")
                    .setDescription("❌ The queue is empty")
                    .setColor('Red')
                return interaction.reply({ embeds: [embed] });
            }

            const tracks = queue.slice(0, 10);
            const tracksString = tracks.map((track, index) => {
                return `${index + 1}. [${track.title}](${track.uri}) - ${formatDuration(track.length)}`;
            }).join("\n");
            const totalPages = Math.ceil(queue.length / 10);

            embed
                .setTitle("Queue")
                .setDescription(`**Now Playing:** [${current.title}](${current.uri}) - \`${formatDuration(current.length)}\`\n\n${queue.length > 0 ? "**Up Next:**\n" + tracksString : "Add more songs to the queue!"}`)
                .setColor('Random')
                .setThumbnail(current.thumbnail)
            // .setFooter({ text: `Page 1 of ${Math.ceil(queue.length / 10)}` });
            if (totalPages > 0) {
                embed.setFooter({ text: `Page 1 of ${totalPages}` });
            }
            const guildQueueMessage = client.queueMessages.get(interaction.guild.id);
            if (guildQueueMessage) {
                try {
                    const oldMessage = await interaction.channel.messages.fetch(guildQueueMessage);
                    if (oldMessage) await oldMessage.delete();
                } catch (error) {
                    console.error("Failed to delete old queue message:", error);
                }
            }

            await interaction.reply({ embeds: [embed], components: [queueButtons(1, Math.ceil(queue.length / 10))] });
            const queueMessage = await interaction.fetchReply(); // ✅ Fetch the sent message

            client.queueMessages.set(interaction.guild.id, queueMessage.id);

        } catch (error) {
            console.error(error);
            embed
                .setTitle("Error")
                .setDescription("❌ There was an error getting the queue")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] });

        }
    }
};
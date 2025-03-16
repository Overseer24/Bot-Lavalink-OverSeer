const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");



module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue-clear")
        .setDescription("Clears the queue"),
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
            player.queue.clear();
            embed
                .setTitle("Success")
                .setDescription("✅ Cleared the queue")
                .setColor('Green')

            return interaction.reply({ embeds: [embed] });

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
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove-queue")
        .setDescription("Removes a song from the queue")
        .addIntegerOption(option =>
            option.setName("index")
                .setDescription("The index of the song to remove")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const {options} = interaction;
        const embed = new EmbedBuilder();
        const player = client.manager.players.get(interaction.guild.id);

        if (!player) {
            embed
                .setTitle("Error")
                .setDescription("❌ Nothing is playing right now")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] });
        }

        const { channel } = interaction.member.voice;

        const botVoiceChannel = client.manager.players.get(interaction.guild.id)?.voiceId; // Lavalink bot voice channel
        const memberVoiceChannel = interaction.member.voice.channel?.id; // User's voice channel

        if (!channel || memberVoiceChannel !== botVoiceChannel) {
            embed
                .setTitle("Error")
                .setDescription("❌ You must be in the same voice channel as me to use this command!")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] });
        }

        const index = options.getInteger("index") - 1;
        if (index < 0 || index >= player.queue.length) { // Check if the index is valid
            embed
                .setTitle("Error")
                .setDescription("❌ Invalid song index")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] });
        }

        const removed = player.queue.splice(index, 1);
      
        embed
            .setTitle("Success")
            .setDescription(`✅ Removed [${removed[0].title}](${removed[0].uri}) from the queue`)
            .setColor('Green')
        return interaction.reply({ embeds: [embed] });
    }

}
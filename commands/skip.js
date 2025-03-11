const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song playing"),
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


        // if (!player.queue.current) {
        //     return await interaction.reply({ content: "There is no song currently playing", ephemeral: true });
        // }
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
        try {
            await player.skip();
            embed
                .setTitle("Success")
                .setDescription("⏭️ Skipped the current song")
                .setColor('Green')
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            embed
                .setTitle("Error")
                .setDescription("❌ There was an error skipping the song")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] });
        }
    }
}
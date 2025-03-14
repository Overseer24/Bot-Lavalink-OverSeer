const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { checkVoiceChannel } = require("../utils/voiceChannelUtils");


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

        if (!player.queue.current) {
            embed
                .setTitle("Error")
                .setDescription("❌ There is no song currently playing")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] }, { flags: MessageFlags.Ephemeral });
        }

        const memberVoiceChannel = interaction.member.voice.channel;
        if (!memberVoiceChannel) {
            embed
                .setTitle("Error")
                .setDescription("❌ You must be in a voice channel to use this command!")
                .setColor("Red");
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
        const botMember = await interaction.guild.members.fetchMe();
        const botVoiceChannel = botMember.voice.channel;

        if (botVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id) {
            embed.setTitle("Error").setDescription("❌ You must be in the same voice channel as me!").setColor("Red");
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
        // If the bot is disconnected but still has a queue, reconnect it

        if (!botVoiceChannel && player.queue.length > 0) {
            player.setVoiceChannel(memberVoiceChannel.id);
            await player.pause(false);
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
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
    }
}
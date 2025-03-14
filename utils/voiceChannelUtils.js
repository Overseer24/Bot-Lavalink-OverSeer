const { EmbedBuilder, MessageFlags } = require("discord.js");


async function checkVoiceChannel(interaction, player, allowReconnect = false) {

    const embed = new EmbedBuilder();
    const memberVoiceChannel = interaction.member.voice.channel;
 
    if (!memberVoiceChannel) {
        embed.setTitle("Error").setDescription("❌ You must be in a voice channel to use this command!").setColor("Red");
        return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
    const botMember = await interaction.guild.members.fetchMe();
    const botVoiceChannel = botMember.voice.channel;

    if (!botVoiceChannel || botVoiceChannel.id !== memberVoiceChannel.id) {
        embed.setTitle("Error").setDescription("❌ You must be in the same voice channel as me!").setColor("Red");
        return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }

    if (!botVoiceChannel && allowReconnect) {
        player.setVoiceChannel(memberVoiceChannel.id);
        await player.pause(false);
    } 
    // else if (!botVoiceChannel) {
    //     embed.setTitle("Error").setDescription("❌ I am not in a voice channel").setColor("Red");
    //     return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        
    // }
}
// const {checkVoiceChannel} = require("../utils/voiceChannelUtils");



module.exports = { checkVoiceChannel };
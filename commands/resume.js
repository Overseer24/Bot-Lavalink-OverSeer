const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { clearNowPlayingMessage } = require("../utils/clearNowPlayingMessage");
const { checkVoiceChannel } = require("../utils/voiceChannelUtils");
const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the current song"),


    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        const embed = new EmbedBuilder();
        if (!player) {
            embed
                .setTitle("Error")
                .setDescription("❌ Nothing is playing right now")
                .setColor('Red')
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        if (!player.queue.current) {
            embed
                .setTitle("Error")
                .setDescription("❌ There is no song currently playing")
                .setColor('Red')
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        // const { channel } = interaction.member.voice;

        // const botVoiceChannel = client.manager.players.get(interaction.guild.id)?.voiceId; // Lavalink bot voice channel
        // const memberVoiceChannel = interaction.member.voice.channel?.id; // User's voice channel

        // if (!channel || memberVoiceChannel !== botVoiceChannel) {
        //     embed
        //         .setTitle("Error")
        //         .setDescription("❌ You must be in the same voice channel as me to use this command!")
        //         .setColor('Red')
        //     return interaction.reply({ embeds: [embed] , flags: MessageFlags.Ephemeral});
        // }

        //make this a reusable function in the future 
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
        if (!botVoiceChannel) {
            player.setVoiceChannel(memberVoiceChannel.id);
        }

        // await checkVoiceChannel(interaction, player, true);

        if (!player.paused) {
            embed
                .setTitle("Error")
                .setDescription("❌ The player is already playing")
                .setColor('Red')
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        try {
            await player.pause(false);
            embed
                .setTitle("Success")
                .setDescription("⏸️ Resumes the current song")
                .setColor('Green')

            await clearNowPlayingMessage(client, interaction.guild.id, player);
            const eventPath = path.join(__dirname, "../events/other/playerStart.js");
            const playerStartEvent = require(eventPath);
            await playerStartEvent.execute(client, player, player.queue.current);

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            embed
                .setTitle("Error")
                .setDescription("❌ There was an error resuming the song")
                .setColor('Red')
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
    }

}
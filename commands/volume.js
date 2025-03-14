const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require("discord.js")
const path = require("path");
const { clearNowPlayingMessage } = require("../utils/clearNowPlayingMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Set the volume of the player")
        .addIntegerOption(option =>
            option.setName("volume")
                .setDescription("The volume to set")
                .setRequired(true)
                .setMaxValue(100)
                .setMinValue(0)
        ),

    async execute(interaction, client) {
        const { options } = interaction;
        const embed = new EmbedBuilder();
        const player = client.manager.players.get(interaction.guild.id);
        const volume = options.getInteger("volume");

        if (!player) {
            embed
                .setTitle("Error")
                .setDescription("❌ Nothing is playing right now")
                .setColor('Red')
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        // const memberVoiceChannel = interaction.member.voice.channel;
        // if (!memberVoiceChannel) {
        //     embed
        //         .setTitle("Error")
        //         .setDescription("❌ You must be in a voice channel to use this command!")
        //         .setColor("Red");
        //     return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        // }

        // const botMember = await interaction.guild.members.fetchMe();
        // const botVoiceChannel = botMember.voice.channel;

        // if (botVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id) {
        //     embed.setTitle("Error").setDescription("❌ You must be in the same voice channel as me!").setColor("Red");
        //     return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        // }
        await checkVoiceChannel(interaction, player, false);

        try {
            await player.setVolume(volume);
            embed
                .setTitle("Success")
                .setDescription(`🔊 Set the volume to ${volume}`)
                .setColor('Green')
            await clearNowPlayingMessage(client, interaction.guild.id, player);
            const eventPath = path.join(__dirname, "../events/other/playerStart.js");
            const playerStartEvent = require(eventPath);
            await playerStartEvent.execute(client, player, player.queue.current);
            return interaction.reply({ embed: embed, flags: MessageFlags.Ephemeral });
        } catch (error) {
            console.error(error);
            embed
                .setTitle("Error")
                .setDescription("❌ There was an error setting the volume")
                .setColor('Red')
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });

        }

    }
}
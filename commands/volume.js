const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require("discord.js")
const path = require("path");
const { clearNowPlayingMessage } = require("../utils/clearNowPlayingMessage");
const { checkVoiceChannel } = require("../utils/voiceChannelUtils");
const { buttons } = require("../utils/buttonsComponents.js")
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
        if (!player.queue.current) {
            embed
                .setTitle("Error")
                .setDescription("❌ There is no song currently playing")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] }, { flags: MessageFlags.Ephemeral });
        }
        try {
            // await interaction.deferReply();
            await checkVoiceChannel(interaction, player, false);

            if (!player.volume == volume) {
                embed
                    .setTitle("Error")
                    .setDescription("❌ The volume is already set to that value")
                    .setColor('Red')
                return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }
            await player.setVolume(volume);
            await clearNowPlayingMessage(client, interaction.guild.id, player);
            const eventPath = path.join(__dirname, "../events/other/playerStart.js");
            const playerStartEvent = require(eventPath);
            await playerStartEvent.execute(client, player, player.queue.current);
            embed
                .setTitle("Success")
                .setDescription(`🔊 Set the volume to ${volume}`)
                .setColor('Green')
            const row = buttons();
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            embed
                .setTitle("Error")
                .setDescription("❌ There was an error setting the volume")
                .setColor('Red')
            // return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

    }
}
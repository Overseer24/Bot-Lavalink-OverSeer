const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require("discord.js");
const { checkVoiceChannel } = require("../utils/voiceChannelUtils");
const { updateQueueMessage } = require("../utils/updateQueueMessage");
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
        const { options } = interaction;
        const embed = new EmbedBuilder();
        const player = client.manager.players.get(interaction.guild.id);

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

        try {
            checkVoiceChannel(interaction, player, false);
            const index = options.getInteger("index") - 1;
            if (index < 0 || index >= player.queue.length) { // Check if the index is valid
                embed
                    .setTitle("Error")
                    .setDescription("❌ Invalid song index")
                    .setColor('Red')
                return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }

            const removed = player.queue.splice(index, 1);
            await updateQueueMessage(client, interaction.guild.id, player);
            embed
                .setTitle("Success")
                .setDescription(`✅ Removed [${removed[0].title}](${removed[0].uri}) from the queue`)
                .setColor('Green')
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            embed
                .setTitle("Error")
                .setDescription("❌ An error occurred while removing the song")
                .setColor('Red')
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

    }

}
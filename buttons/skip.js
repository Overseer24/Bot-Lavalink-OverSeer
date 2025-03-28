const { EmbedBuilder, MessageFlags} = require("discord.js");
const { updateQueueMessage } = require("../utils/updateQueueMessage");

module.exports = {
    customId: "skip",
    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);

        const embed = new EmbedBuilder();

        // console.log("Player exists:", !!player);
        // console.log("Current song exists:", !!player?.queue?.current);

        if (!player) {
            embed
                .setTitle("Error")
                .setDescription("❌ Nothing is playing right now")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] }, { flags: MessageFlags.Ephemeral });
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
        // console.log(player.queue.length);
        // if (!botVoiceChannel && player.queue.length > 1) {
        //     player.setVoiceChannel(memberVoiceChannel.id);
        // }

        if (!botVoiceChannel) {
            embed
                .setTitle("Error")
                .setDescription("❌ I am not connected to a voice channel")
                .setColor('Red')
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        try {
            await player.skip();
            await updateQueueMessage(client, interaction.guild.id, player);
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
    },
};




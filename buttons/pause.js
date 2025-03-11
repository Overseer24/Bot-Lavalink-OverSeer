const { EmbedBuilder } = require("discord.js");

module.exports = {
    customId: "pause",
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
            return interaction.reply({ embeds: [embed] });
        }

        if (!player.queue.current) {
            embed
                .setTitle("Error")
                .setDescription("❌ There is no song currently playing")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] });
        }

        //make this a reusable function in the future
        const memberVoiceChannel = interaction.member.voice.channel;
        if (!memberVoiceChannel) {
            embed.setTitle("Error").setDescription("❌ You must be in a voice channel to use this command!").setColor("Red");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const botMember = await interaction.guild.members.fetchMe();
        const botVoiceChannel = botMember.voice.channel;
        if (!botVoiceChannel || botVoiceChannel.id !== memberVoiceChannel.id) {
            embed.setTitle("Error").setDescription("❌ You must be in the same voice channel as me!").setColor("Red");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        // if the player is already paused, return an error
        if (player.paused) {
            embed   
                .setTitle("Error")
                .setDescription("❌ The player is already paused")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] }, { ephemeral: true });
        }
        try {
            await player.pause(true);

            embed
                .setTitle("Success")
                .setDescription("⏸️ Paused the current song")
                .setColor('Green')
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            embed
                .setTitle("Error")
                .setDescription("❌ There was an error pausing the song")
                .setColor('Red')
            return interaction.reply({ embeds: [embed] }, { ephemeral: true });
        }
    },
};




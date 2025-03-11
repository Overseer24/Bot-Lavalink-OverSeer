const { EmbedBuilder } = require("discord.js");

module.exports = {
    customId: "resume",
    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);
        const { channel } = interaction.member.voice;
        const embed = new EmbedBuilder();

        // console.log("Player exists:", !!player);
        // console.log("Current song exists:", !!player?.queue?.current);


        //check if bot is connected to a voice channel then play since disconnected only


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
            embed
                .setTitle("Error")
                .setDescription("❌ You must be in a voice channel to use this command!")
                .setColor("Red");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const botMember = await interaction.guild.members.fetchMe();
        const botVoiceChannel = botMember.voice.channel;
        if (botVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id) {
            embed.setTitle("Error").setDescription("❌ You must be in the same voice channel as me!").setColor("Red");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        // If the bot is disconnected but still has a queue, reconnect it
        if (!botVoiceChannel) {
            player.setVoiceChannel(memberVoiceChannel.id);
        }

        // if the player is already playing, return an error
        if (!player.paused) {
            embed
                .setTitle("Error")
                .setDescription("❌ The music is already playing")
                .setColor('Red')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            await player.pause(false);

            embed
                .setTitle("Success")
                .setDescription("⏸️ Resumed the current song")
                .setColor('Green')
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            embed
                .setTitle("Error")
                .setDescription("❌ There was an error resuming the song")
                .setColor('Red')
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};




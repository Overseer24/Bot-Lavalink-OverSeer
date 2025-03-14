const { EmbedBuilder, MessageFlags } = require("discord.js");
const {clearNowPlayingMessage} = require("../utils/clearNowPlayingMessage");
const {checkVoiceChannel} = require("../utils/voiceChannelUtils");
const path = require("path");
module.exports = {
    customId: "shuffle",
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
            await player.queue.shuffle();

            embed
                .setTitle("Success")
                .setDescription("⏸️ Shuffled the queue")
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
                .setDescription("❌ There was an error shuffling the queue")
                .setColor('Red')
            return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }
    },
};




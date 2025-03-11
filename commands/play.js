const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song from YouTube or Spotify")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("Song name or URL")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        
        try {
            await interaction.deferReply();
            const embed = new EmbedBuilder();

            const query = interaction.options.getString("query");
            const { channel } = interaction.member.voice;
            if (!channel) {
                embed
                    .setTitle("Error")
                    .setDescription("❌ You must be in a voice channel to use this command!")
                    .setColor('Red')
                return interaction.editReply({ embeds: [embed] });

            }

            if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SPEAK)) {
                embed
                    .setTitle("Error")
                    .setDescription("❌ I don't have permission to connect to the voice channel!")
                    .setColor('Red')
                return interaction.editReply({ embeds: [embed] });
                // return interaction.reply({ content: "❌ I don't have permission to connect to the voice channel!", ephemeral: true });
            }

            let player = client.manager.players.get(interaction.guild.id);
            if (!player) {
                player = await client.manager.createPlayer({
                    guildId: interaction.guild.id,
                    voiceId: channel.id,
                    textId: interaction.channel.id,
                    volume: 50,
                    deaf: true,
                });

                // Force connect the bot to the VC

            }

            const res = await player.search(query, { requester: interaction.user });
            if (!res.tracks.length) {
                embed
                    .setTitle("Error")
                    .setDescription("❌ No results found!")
                    .setColor('Red')
                return interaction.editReply({ embeds: [embed] });
            }

            if (res.type === "PLAYLIST") {
                for (let track of res.tracks) {
                    player.queue.add(track);
                }
                if (!player.playing && !player.paused) {
                    player.play();
                }

                const embed = new EmbedBuilder()
                    .setTitle("Playlist added")
                    .setDescription(`🎶 Added **${res.tracks.length}** songs to the queue`)
                    .setColor("RANDOM")
                return interaction.editReply({ embeds: [embed] });


            }
            else {
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused) {
                    player.play();
                }

                embed
                    .setTitle("Song added")
                    .setDescription(`🎶 Added **${res.tracks[0].title}** to the queue`)
                    .setColor("Red")

                return interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: "❌ There was an error while processing your request!" });

        }




        // if (!interaction.member.voice.channelId) {
        //     return interaction.reply({ content: "❌ You must be in a voice channel!", ephemeral: true });
        // }

        // if (!interaction.client.kazagumo) {
        //     return interaction.reply({ content: "❌ Lavalink is not initialized!", ephemeral: true });
        // }

        // // Get the Kazagumo player for the guild
        // let player = interaction.client.kazagumo.players.get(interaction.guild.id);

        // // If there's no player, create and connect one
        // if (!player) {
        //     player = await interaction.client.kazagumo.createPlayer({
        //         guildId: interaction.guild.id,
        //         voiceId: interaction.member.voice.channelId,
        //         textId: interaction.channel.id,
        //         volume: 50, // Default volume
        //     });
        // }

        // // Search for the song
        // const result = await interaction.client.kazagumo.search(query, { requester: interaction.user });

        // if (!result.tracks.length) {
        //     return interaction.reply({ content: "❌ No results found!", ephemeral: true });
        // }

        // // Add song to queue
        // player.queue.add(result.tracks[0]);

        // // Start playing if not already playing
        // if (!player.playing) player.play();

        // return interaction.reply({ content: `🎶 Now playing: **${result.tracks[0].title}**` });
    }
};

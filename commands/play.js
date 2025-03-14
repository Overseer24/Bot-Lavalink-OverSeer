const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const path = require("path");


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
            const memberVoiceChannel = interaction.member.voice.channel;
            if (!memberVoiceChannel) {
                embed.setTitle("Error").setDescription("❌ You must be in a voice channel to use this command!").setColor('Red');
                return interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }

            if (!memberVoiceChannel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.SPEAK)) {
                embed.setTitle("Error").setDescription("❌ I don't have permission to speak in this channel!").setColor('Red');
                return interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }



            let player = client.manager.players.get(interaction.guild.id);

            if (player) {
                const botMember = await interaction.guild.members.fetchMe();
                const botVoiceChannel = botMember.voice.channel;
                if (botVoiceChannel && botVoiceChannel.id !== memberVoiceChannel.id) {
                    embed.setTitle("Error").setDescription("❌ You must be in the same voice channel as me!").setColor("Red");
                    return interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
                }

                if (!botVoiceChannel) {
                    player.setVoiceChannel(memberVoiceChannel.id);
                    player.pause(false);

                    // ✅ If there's a currently playing track, manually trigger "Now Playing"
                    if (player.queue.current) {
                        const eventPath = path.join(__dirname, "../events/other/playerStart.js");
                        const playerStartEvent = require(eventPath);
                        await playerStartEvent.execute(client, player, player.queue.current);
                    }
                }

            }



            if (!player) {
                player = await client.manager.createPlayer({
                    guildId: interaction.guild.id,
                    voiceId: channel.id,
                    textId: interaction.channel.id,
                    volume: 1,
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
                return interaction.editReply({ embeds: [embed], flags: MessageFlags.Ephemeral });
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
                    .setColor('Random')
                return interaction.editReply({ embeds: [embed] });


            }
            else {
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused) {
                    player.play();
                    // console.log(player.queue.current)
                }

                embed
                    .setTitle("Song added")
                    .setDescription(`🎶 Added **${res.tracks[0].title}** to the queue`)
                    .setColor("Red")

                return interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: "❌ There was an error while processing your request!", flags: MessageFlags.Ephemeral });

        }

    }
};

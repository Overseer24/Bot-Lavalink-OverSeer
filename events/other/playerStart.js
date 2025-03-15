const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const path = require("path");
const { formatDuration } = require("../../utils/durationFormatter.js");
const { buttons } = require("../../utils/buttonsComponents.js")


module.exports = {
    name: 'playerStart',
    async execute(client, player, track) {
        try {
            const textChannel = client.channels.cache.get(player.textId);
            if (!textChannel) return;

            const requester = player.queue.current.requester
                ? `<@${player.queue.current.requester.id}>`
                : "Unknown";

            const embed = new EmbedBuilder()
                .setTitle("🎶Now Playing")
                // .setDescription(` [${track.title}](${track.uri})`)
                .setDescription(`**[${track.title || "Unknown"}](${track.uri})** - \`${track.author}\` `)
                .addFields(
                    { name: "**Duration:**", value: `${formatDuration(track.length)}`, inline: true },
                    { name: "**Requested by:**", value: `${requester}`, inline: true },
                    { name: "**Volume:**", value: `${player.volume}%`, inline: true },
                    { name: "**Next Song:**", value: `${player.queue.length > 0 ? `[${player.queue[0].title}](${player.queue[0].uri})` : "No songs in queue"}`, inline: true },

                )
                // .addField({})
                .setColor('Random')

            const row = buttons();

            if (track.thumbnail) {
                embed.setThumbnail(track.thumbnail);
            }
            else {
                embed.setThumbnail(client.user.displayAvatarURL());
            }


            // Send the embed message and store it in a variable to track it
            const nowPlayingMessageNew = await textChannel.send({
                embeds: [embed],
                components: [row]
            });

            // Store the new message reference for future use
            client.nowPlayingMessages.set(player.guildId, nowPlayingMessageNew.id);
        } catch (error) {
            console.error(error);
        }

    }
};
const { EmbedBuilder } = require("discord.js")
const path = require("path");
const {formatDuration} = require( "../../utils/durationFormatter.js");
const format =path.join(__dirname, "../../utils/durationFormatter")


module.exports = {
    name: 'playerStart',
    async execute(client, player, track) {
        try {
            const textChannel = client.channels.cache.get(player.textId);
            if (!textChannel) return;
            // console.log("Track:", track);
            // console.log("Player:", player);
            // console.log("Player Start:", player.queue.current);
            const requester = player.queue.current.requester
                ? `<@${player.queue.current.requester.id}>`
                : "Unknown";

            const embed = new EmbedBuilder()
                .setTitle("🎶Now Playing")
                // .setDescription(` [${track.title}](${track.uri})`)
                .setDescription(`**[${track.title}](${track.uri})** - \`${formatDuration(track.length)}\`\n\n👤 **Requested by:** ${requester}`)
                .setColor('Random')
              

            if (track.thumbnail) {
                embed.setThumbnail(track.thumbnail);
            }
            else {
                embed.setThumbnail(client.user.displayAvatarURL());
            }

            await textChannel.send({ embeds: [embed] });


        } catch (error) {
            console.error(error);
        }

    }
};
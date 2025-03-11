const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "playerResumed",

    async execute(client, player) {
        console.log("Track resumed")
        
        // try{
        //     const textChannel = client.channels.cache.get(player.textId);
        //     if (!textChannel) return;

        // }catch (error) {
        //     console.error(error);
        // }
        
    }
}
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function queueButtons(currentPage, totalPages) {
    const previous = new ButtonBuilder()
        .setCustomId("previousPage")
        .setLabel("Previous Page")
        .setStyle(1)
        .setEmoji("⬅️")
        .setDisabled(currentPage <= 1) // Left arrow icon
        
    const next = new ButtonBuilder()
        .setCustomId("nextPage")
        .setLabel("Next Page")
        .setStyle(1)
        .setEmoji("➡️") // Right arrow icon
        .setDisabled(currentPage >= totalPages)


    return new ActionRowBuilder().addComponents(previous, next);
}

module.exports = { queueButtons };
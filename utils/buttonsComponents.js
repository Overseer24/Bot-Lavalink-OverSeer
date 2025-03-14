const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function buttons() {
    const skip = new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("Skip")
        .setStyle(1)
        .setEmoji("⏭️"); // Next track icon

    const pause = new ButtonBuilder()
        .setCustomId("pause")
        .setLabel("Pause")
        .setStyle(1)
        .setEmoji("⏸️"); // Pause icon

    const resume = new ButtonBuilder()
        .setCustomId("resume")
        .setLabel("Resume")
        .setStyle(1)
        .setEmoji("▶️"); // Play icon

    const shuffle = new ButtonBuilder()
        .setCustomId("shuffle")
        .setLabel("Shuffle")
        .setStyle(1)
        .setEmoji("🔀"); // Shuffle icon

    return new ActionRowBuilder().addComponents(skip, pause, resume , shuffle);
}

module.exports = { buttons };
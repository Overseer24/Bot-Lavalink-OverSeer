async function clearNowPlayingMessage(client, guildId, player) {
    const nowPlayingMessageId = client.nowPlayingMessages.get(guildId);
    if (!nowPlayingMessageId) return;

    const textChannel = client.channels.cache.get(player.textId);
    if (!textChannel) return;

    const message = await textChannel.messages.fetch(nowPlayingMessageId).catch(() => null);
    if (message) await message.delete().catch(() => null);

    client.nowPlayingMessages.delete(guildId);
}

module.exports = { clearNowPlayingMessage };

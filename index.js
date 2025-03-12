const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { Kazagumo, Plugins } = require("kazagumo");
const { Shoukaku, Connectors } = require("shoukaku");
require("dotenv").config();
const { loadCommands, loadEvents, loadButtons } = require("./utils/loader");
const fs = require("fs");
const path = require("path");
// const { execute } = require("./commands/play.js");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Map();
client.buttons = new Map();
client.nowPlayingMessages = new Map()
// Lavalink Node Configuration for Shoukaku
const nodes = [
    {
        name: "Main",
        url: `${process.env.LAVALINK_HOST}:${process.env.LAVALINK_PORT}`,
        auth: process.env.LAVALINK_PASSWORD,
        secure: false, // Set to true if using HTTPS/SSL
    },
];

// Initialize Shoukaku
client.manager = new Kazagumo({
    defaultSearchEngine: "youtube",
    plugins: [new Plugins.PlayerMoved(client),],
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), nodes);


// Bot ready event
client.once("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

loadCommands(client);
loadEvents(client);
loadButtons(client);



client.manager.on("playerStart", async (player, track) => {

    try {
        const eventPath = path.join(__dirname, "events", "other", "playerStart.js");
        const playerStartEvent = require(eventPath)
        await playerStartEvent.execute(client, player, track);

    } catch (error) {
        console.error(error);
    }

})
.on("playerEnd", async (player) => {
    try {
        const eventPath = path.join(__dirname, "events", "other", "playerEnd.js");
        const playerEndEvent = require(eventPath);
        await playerEndEvent.execute(client, player)
    } catch (error) {
        console.log(error)
    }
})
.on("playerEmpty", async (player) => {
    try {
        const eventPath = path.join(__dirname, "events", "other", "playerEmpty.js");
        const playerEmptyEvent = require(eventPath);
        await playerEmptyEvent.execute(client, player)
    } catch (error) {

    }
})
.on("playerMoved", async (player, state, channels) => {
    try {
        const eventPath = path.join(__dirname, "events", "other", "playerMoved.js");
        const playerMovedEvent = require(eventPath);
        await playerMovedEvent.execute(player, state, channels, client)
    } catch (error) {
        console.log(error);
    }
}).on("playerResumed", async(player)=>{
    try{
        const eventPath = path.join(__dirname, "events", "other", "playerResumed.js");
        const playerResumedEvent = require(eventPath);
        await playerResumedEvent.execute(client, player)
    }catch(error){
        console.log(error)
    }
})



// Login bot
client.login(process.env.DISCORD_TOKEN).catch(console.error);

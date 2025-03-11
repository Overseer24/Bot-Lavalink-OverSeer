const fs = require('fs');
const path = require('path');

function loadCommands(client) {
    const commandsPath = path.join(__dirname, "../commands");
    const commandFiles = fs.readdirSync("./commands");
    for (const fileOrFolder of commandFiles) {
        const fullPath = path.join(commandsPath, fileOrFolder);
       
        if (fs.statSync(fullPath).isDirectory()) {
            const subFiles = fs.readdirSync(fullPath).filter(file => file.endsWith(".js"));

            for (const file of subFiles) {
                const filePath = path.join(fullPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                } else {
                    // console.log(`Command ${file} is missing 'data' or 'execute'`);
                }
            }
        }
        else if (fileOrFolder.endsWith(".js")) {
            const command = require(fullPath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                // console.log(`Command ${file} is missing 'data' or 'execute'`);
            }
        }
    }
}

function loadEvents(client) {
    const eventsPath = path.join(__dirname, "../events");
    // console.log("Events Path:", eventsPath);
    fs.readdirSync(eventsPath).forEach((file) => {
        if (file.endsWith(".js")) {
            const event = require(path.join(eventsPath, file));
            console.log(`Event ${file} loaded`);
            client.on(event.name, (...args) => event.execute(...args));
        }
    });
}

module.exports = { loadCommands, loadEvents };


// const fs = require('fs');

// function loadCommands(client) {
//     const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//     for (const file of commandFiles) {
//         const command = require(`../commands/${file}`);
//         client.commands.set(command.data.name, command);
//     }
// }

// function loadEvents(client) {
//     const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

//     for (const file of eventFiles) {
//         const event = require(`../events/${file}`);
//         client.on(event.name, (...args) => event.execute(...args));
//     }
// }

// module.exports = { loadCommands, loadEvents };



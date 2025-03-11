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
            // console.log(`Event ${file} loaded`);
            client.on(event.name, (...args) => event.execute(...args));
        }
    });
}

function loadButtons(client) {
    const buttonsPath = path.join(__dirname, "../buttons");
    if (!fs.existsSync(buttonsPath)) {
        console.log("Buttons folder does not exist.");
        return;
    }

    const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith(".js"));

    for (const file of buttonFiles) {
        const button = require(path.join(buttonsPath, file));

        if ('customId' in button && 'execute' in button) {
            client.buttons.set(button.customId, button);
        } else {
            console.log(`Button ${file} is missing 'customId' or 'execute'`);
        }
    }
    // const buttonsPath = path.join(__dirname, "../buttons");
    // const buttonFiles = fs.readdirSync("./buttons");
    // for (const fileOrFolder of buttonFiles) {
    //     const fullPath = path.join(buttonsPath, fileOrFolder);

    //     if (fs.statSync(fullPath).isDirectory()) {
    //         const subFiles = fs.readdirSync(fullPath).filter(file => file.endsWith(".js"));

    //         for (const file of subFiles) {
    //             const filePath = path.join(fullPath, file);
    //             const button = require(filePath);
    //             if ('customId' in button && 'execute' in button) {
    //                 client.buttons.set(button.customId, button);
    //             } else {

    //             }
    //         }
    //     }
    //     else if (fileOrFolder.endsWith(".js")) {
    //         const button = require(fullPath);
    //         if ('customId' in button && 'execute' in button) {
    //             client.buttons.set(button.customId, button);
    //         } else {

    //         }
    //     }
    // }
}

module.exports = { loadCommands, loadEvents, loadButtons };


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



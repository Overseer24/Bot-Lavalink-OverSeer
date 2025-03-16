const { MessageFlags } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, interaction.client);

            } catch (error) {
                console.error(error);
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply('❌ There was an error executing this command.');
                } else {
                    await interaction.reply({ content: '❌ There was an error executing this command.', ephemeral: true });
                }
            }
        } else if (interaction.isButton()) {
            const button = interaction.client.buttons.get(interaction.customId);
            if (!button) return;

            try {
                await button.execute(interaction, interaction.client);
            } catch (error) {
                console.error(error);
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply('❌ There was an error executing this button.');
                } else {
                    await interaction.reply({ content: '❌ There was an error executing this button.', flags: MessageFlags.Ephemeral });
                }
            }
        }
    }
};

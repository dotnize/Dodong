const Command = require("../structures/command.js");
const config = require("../config");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = new Command({
    name: "testslash",
    aliases: [],
    description: "Register slash commands for the server.",
    permission: "ADMINISTRATOR",
    async run(message, args, client, slash) {
        const slashCommands = client.commands.map(cmd => ({
            name: cmd.name,
            description: cmd.description,
            options: cmd.options,
            defaultPermission: true
        }));
        const rest = new REST({ version: '9' }).setToken(config.botToken);
        await rest.put(Routes.applicationGuildCommands(config.clientId, message.guildId), { body: slashCommands })
            .then(() => message.reply(`Slash commands have been registered for this guild.\nOnce the global commands cache has updated, this guild might show duplicated commands.`))
            .catch(error => {
                message.reply(`error: ${error}`);
            });
    }
});
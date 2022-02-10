const Command = require("../structures/command.js");
const { MessageEmbed } = require('discord.js');
module.exports = new Command({
	name: "help",
	aliases: [],
	description: "Displays all server commands",
	permission: "SEND_MESSAGES",
	async run(message, args, client, slash) {
		let list = "Commands:\n";
		client.commands.forEach(cmd => {
			list = list.concat(`\n${client.prefix}${cmd.name}`);
			if(cmd.options.length > 0) {
				cmd.options.forEach(option => {
					list = list.concat(` <${option.name}>`);
				});
			}
			//list = list.concat(`\n${cmd.description}\n`);
			// todo: add description, split to multiple pages, add buttons for pages
		});
        const embed = new MessageEmbed();
        embed.setColor('#44b868');
        embed.setDescription(list);
        return message.reply({ embeds: [embed] });
	}
});

const Command = require("../structures/command.js");
const { EmbedBuilder } = require('discord.js');
const generatePages = require('../utils/embedPages.js');
module.exports = new Command({
	name: "help",
	aliases: [],
	description: "Displays all server commands",
	permission: "SEND_MESSAGES",
	async run(message, args, client, slash) {
		const pages = [];
        let page = 1, emptypage = false, commandInfo;
        do {
            const pageStart = 6 * (page - 1);
            const pageEnd = pageStart + 6;
            const commands = client.commands.slice(pageStart, pageEnd).map(cmd => {
				commandInfo = `**${client.prefix}${cmd.name}**`;
				if(cmd.options.length > 0) {
					cmd.options.forEach(option => {
						commandInfo = commandInfo.concat(` <${option.name}>`);
					});
				}
				commandInfo = commandInfo.concat(`\n${cmd.description}\n`);
				return commandInfo;
			});
            if(commands.length) {
				const embed = new EmbedBuilder();
				embed.setAuthor({ name: `Commands` });
                embed.setDescription(`${commands.join('\n')}`);
                embed.setColor(page%2 ? '#44b868' : '#b84e44');
                pages.push(embed);
                page++;
            }
            else {
                emptypage = true;
                if(page === 2) {
                    return message.reply({ embeds: [pages[0]] });
                }
            }
        } while(!emptypage);

		generatePages(message, pages, { timeout: 40000 });
	}
});

const Command = require("../structures/command.js");
const { MessageEmbed } = require('discord.js');
module.exports = new Command({
	name: "about",
	aliases: [],
	description: "Shows information about the bot",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const embed = new MessageEmbed();
        embed.setAuthor("All about Dodong", client.user.displayAvatarURL())
        embed.setColor('#44b868');
        embed.setDescription(`Hi there! I am **Dodong**, and I'm an open-source music bot written in JavaScript using [Node.js](https://nodejs.org), [discord.js](https://discord.js.org), and [discord-player](https://discord-player.js.org).\n`+
        `I am currently in **${client.guilds.cache.size}** servers.\n\n`+ 
        `Type \`${client.prefix}help\` to see all my commands.\n`+
        `Type \`${client.prefix}play\` to start listening to music!\n`+
        `**[Join my server](https://discord.gg/qztcCcpKsr)** or **[invite me](https://discord.com/oauth2/authorize?client_id=834688899476881411&permissions=36785472&scope=bot)** to your server!\n\n`+
        `Developers: [nize#5846](https://github.com/nizeic), [Kenshin#3900](https://github.com/JoshCunningHum)`+
        `\`\`\`\n`+
        `Node.js: ${process.version}\n`+
        `discord.js: ${require('../package.json').dependencies["discord.js"]}\n`+
        `discord-player: ${require('../package.json').dependencies["discord-player"]}\n`+
        `play-dl: ${require('../package.json').dependencies["play-dl"]}`+
        `\`\`\``+
        `[View on GitHub](https://github.com/nizeic/Dodong)`);
        return message.channel.send({ embeds: [embed] });
	}
});

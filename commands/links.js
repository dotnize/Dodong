const Command = require("../structures/command.js");
const { MessageEmbed } = require('discord.js');
const config = require("../config");

module.exports = new Command({
	name: "links",
	aliases: [],
	description: "Displays all server commands",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const embed = new MessageEmbed();
        embed.setColor('#44b868');
        embed.setDescription(`**Links:**\n
        Want to contribute?
        https://github.com/nizeic/Dodong
        Online Web Player (NEW)
        ${config.webplayer}?guildID=${message.guild.id}
        `);
        return message.channel.send({ embeds: [embed] });
	}
});

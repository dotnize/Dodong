const Command = require("../structures/command.js");
const { MessageEmbed } = require('discord.js');

module.exports = new Command({
	name: "ping",
	aliases: [],
	description: "Shows the ping of the bot!",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
		const embed = new MessageEmbed()
			.setDescription(`Client ping: ${client.ws.ping} ms`);
		const m = await message.channel.send({ embeds: [embed] });
		embed.setDescription(` :green_circle: API latency: **${client.ws.ping} ms**\n :orange_circle: Message latency: **${m.createdTimestamp - message.createdTimestamp} ms**\n`);
		embed.setFooter(`skl: the ping command displays the latency between the Discord API and the bot's host. if you want to test your internet speed, use a proper speedtest service.\ndiscord bots cannot detect the ping/latency of users.`);
		m.edit(
			{ embeds: [embed] }
		);
	}
});
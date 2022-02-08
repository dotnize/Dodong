const Command = require("../structures/command.js");
const { MessageEmbed } = require('discord.js');

module.exports = new Command({
	name: "ping",
	aliases: [],
	description: "Shows the ping of the bot!",
	permission: "SEND_MESSAGES",
	async run(message, args, client, slash) {
		const embed = new MessageEmbed()
			.setDescription(`Client ping: ${client.ws.ping} ms`).setColor('#b84e44');
		const m = await message.channel.send({ embeds: [embed] });
		embed.setDescription(` :green_circle: API latency: **${client.ws.ping} ms**\n :orange_circle: Message latency: **${m.createdTimestamp - message.createdTimestamp} ms**\n`).setColor('#44b868');
		m.edit(
			{ embeds: [embed] }
		);
	}
});
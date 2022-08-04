const Command = require("../structures/command.js");
const { EmbedBuilder } = require('discord.js');

module.exports = new Command({
	name: "ping",
	aliases: [],
	description: "Shows the ping of the bot",
	permission: "SEND_MESSAGES",
	async run(message, args, client, slash) {
		const embed = new EmbedBuilder()
			.setDescription(` :green_circle: API latency: **${client.ws.ping} ms**`).setColor('#b84e44');
		const m = await message.reply({ embeds: [embed] });
		const msg = slash ? await message.fetchReply() : m;
		embed.setDescription(` :green_circle: API latency: **${client.ws.ping} ms**\n :orange_circle: Message latency: **${msg.createdTimestamp - message.createdTimestamp} ms**\n`).setColor('#44b868');
		msg.edit(
			{ embeds: [embed] }
		);
	}
});
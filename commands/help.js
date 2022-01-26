const Command = require("../structures/command.js");
const { MessageEmbed } = require('discord.js');
module.exports = new Command({
	name: "help",
	aliases: [],
	description: "Displays all server commands",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const embed = new MessageEmbed();
        embed.setColor('#44b868');
        embed.setDescription(`**Commands:**\n
        - clear
        - disconnect / dc
        - filter / f *(experimental)*
        - loop
        - lyrics / l
        - move / m
        - nowplaying / np
        - pause
        - ping
        - play / p
        - previous / prev / back
        - queue / q
        - remove / r
        - resume
        - seek / s *(experimental)*
        - shuffle
        - skip / next / n
        - together / t / party
	- volume / vol`);
        return message.channel.send({ embeds: [embed] });
	}
});

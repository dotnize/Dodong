const Command = require("../structures/command.js");
const { MessageEmbed } = require('discord.js');
module.exports = new Command({
	name: "help",
	aliases: [],
	description: "Displays all server commands",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const embed = new MessageEmbed();
        embed.setDescription(`**Commands:**\n
        - clear
        - disconnect / dc
	- filter / f
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
        - seek / s
        - shuffle
        - skip / next / n`);
        return message.channel.send({ embeds: [embed] });
	}
});

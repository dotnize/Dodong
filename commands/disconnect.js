const Command = require("../structures/command.js");

module.exports = new Command({
	name: "disconnect",
	aliases: ['dc'],
	description: "Disconnects from the music channel and clears the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client, slash) {
        const queue = client.player.getQueue(message.guild);
        if (queue) await queue.destroy(true);
		message.guild.members.me.voice.disconnect();
        slash ? message.reply({embeds: [{ description: `👋 Disconnected.`, color: 0x44b868 }]}) : message.react('👋');
	}
});
const Command = require("../structures/command.js");

module.exports = new Command({
	name: "clear",
	aliases: [],
	description: "Clears the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client, slash) {
        const queue = client.player.getQueue(message.guild);
        if (queue) {
			queue.clear();

        	slash ? message.reply({embeds: [{ description: `✅ Queue has been cleared.`, color: 0x44b868 }]}) : message.react('✅');
		}
	}
});
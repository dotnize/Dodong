const Command = require("../structures/command.js");

module.exports = new Command({
	name: "clear",
	aliases: [],
	description: "Clears the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (queue) queue.clear();

        message.react('✅');
	}
});
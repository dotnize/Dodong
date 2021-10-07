const Command = require("../structures/command.js");

module.exports = new Command({
	name: "disconnect",
	aliases: ['dc'],
	description: "Disconnects from the music channel and clears the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client, _fromButton = false) {
        const queue = client.player.getQueue(message.guild);
        if (queue) queue.destroy(true);

		if(_fromButton) return;
        message.react('👋');
	}
});
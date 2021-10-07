const Command = require("../structures/command.js");

module.exports = new Command({
	name: "pause",
	aliases: [],
	description: "Pauses the queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client, _fromButton = false) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) return;
        const paused = queue.setPaused(true);

		if(_fromButton) return;
		return paused ? message.react('⏸️') : message.react('❌');
	}
});
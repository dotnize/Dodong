const Command = require("../structures/command.js");

module.exports = new Command({
	name: "resume",
	aliases: [],
	description: "Resumes the queue if it is paused",
	permission: "SEND_MESSAGES",
	async run(message, args, client, _fromButton = false) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) return;
        const paused = queue.setPaused(false);

		if(_fromButton) return;
		return paused ? message.react('▶️') : message.react('❌');
	}
});
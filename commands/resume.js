const Command = require("../structures/command.js");

module.exports = new Command({
	name: "resume",
	aliases: [],
	description: "Resumes the queue if it is paused",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) return;
        const paused = queue.setPaused(false);
		return paused ? message.react('▶️') : message.react('❌');
	}
});
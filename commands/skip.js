const Command = require("../structures/command.js");

module.exports = new Command({
	name: "skip",
    aliases: ['n', 'next'],
	description: "Skips to the next song in the queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client, _fromButton = false) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) return;
        const success = queue.skip();

		if(_fromButton) return;
        return success ? message.react("⏭️") : message.react('❌');
	}
});
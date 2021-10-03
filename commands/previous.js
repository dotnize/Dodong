const Command = require("../structures/command.js");

module.exports = new Command({
	name: "previous",
	aliases: ['back', 'prev'],
	description: "Plays the previous track",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) return;
        
        await queue.back();

        message.react('⏮️');
	}
});
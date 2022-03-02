const Command = require("../structures/command.js");

module.exports = new Command({
	name: "seek",
	aliases: [],
	description: "Clears the server queue",
	permission: "SEND_MESSAGES",
	options: [
        { description: 'Position of current song to seek', name: 'seconds', required: true, type: 4 }
    ],
	async run(message, args, client, slash) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing || !args[0]) return;
        if (args[0] * 1000 >= queue.current.durationMS) return message.react('❌');
		await queue.seek(args[0] * 1000);

        slash ? message.reply({embeds: [{ description: `⏩ Seeking to position.`, color: 0x44b868 }]}) : message.react('⏩');
	}
});
const Command = require("../structures/command.js");

module.exports = new Command({
	name: "shuffle",
	aliases: [],
	description: "Shuffles the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client, slash) {
        const queue = client.player.getQueue(message.guild);
        if (!queue) return;
        
        await queue.shuffle();
        slash ? message.reply({embeds: [{ description: `🔀 Shuffling the queue.`, color: 0x44b868 }]}) : message.react('🔀');
	}
});
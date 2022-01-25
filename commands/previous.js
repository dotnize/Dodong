const Command = require("../structures/command.js");
const config = require("../config");

module.exports = new Command({
	name: "previous",
	aliases: ['back', 'prev'],
	description: "Plays the previous track",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) return;
		
        // For webplayers

        if(config.cors && config.cors[0].length != 0){
            client.io.to(message.guild.id).emit('forceUpdate');
        }

        await queue.back();

        message.react('⏮️');
	}
});
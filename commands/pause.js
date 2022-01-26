const Command = require("../structures/command.js");
const config = require("../config");

module.exports = new Command({
	name: "pause",
	aliases: [],
	description: "Pauses the queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) return;
        const paused = queue.setPaused(true);

        // For webplayers

        if(config.webplayer && config.webplayer.length != 0){
            client.io.to(message.guild.id).emit('forceUpdate');
        }

		return paused ? message.react('⏸️') : message.react('❌');
	}
});
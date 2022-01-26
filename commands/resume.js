const Command = require("../structures/command.js");
const config = require("../config");

module.exports = new Command({
	name: "resume",
	aliases: [],
	description: "Resumes the queue if it is paused",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) return;
        const paused = queue.setPaused(false);

        // For webplayers

        if(config.webplayer && config.webplayer.length != 0){
            client.io.to(message.guild.id).emit('forceUpdate');
        }

		return paused ? message.react('▶️') : message.react('❌');
	}
});
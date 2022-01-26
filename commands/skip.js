const Command = require("../structures/command.js");
const config = require("../config");

module.exports = new Command({
	name: "skip",
    aliases: ['n', 'next'],
	description: "Skips to the next song in the queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) return;
        const success = queue.skip();
        
        // For webplayers

        if(config.webplayer && config.webplayer.length != 0){
            client.io.to(message.guild.id).emit('forceUpdate');
        }

        return success ? message.react("⏭️") : message.react('❌');
	}
});
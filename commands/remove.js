const Command = require("../structures/command.js");

module.exports = new Command({
	name: "remove",
    aliases: ['r'],
	description: "Removes a song from the queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !args[1]) return;
        const trackIndex = args[1] - 1;
        if(!queue.tracks[trackIndex]) return;
        const trackName = queue.tracks[trackIndex].title;
        const trackUrl = queue.tracks[trackIndex].url;
        queue.remove(trackIndex);

        message.channel.send({
            embeds: [
                {
                    description: `Removed [${trackName}](${trackUrl})`,
                    color: 0x44b868
                }
            ]
        });
	}
});
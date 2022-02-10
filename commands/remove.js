const Command = require("../structures/command.js");

module.exports = new Command({
	name: "remove",
    aliases: ['r'],
	description: "Removes a song from the queue",
	permission: "SEND_MESSAGES",
    options: [
        { description: 'Position of song to remove', name: 'position', required: true, type: 4 }
    ],
    
	async run(message, args, client, slash) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !args[0]) return;
        const trackIndex = args[0] - 1;
        if(!queue.tracks[trackIndex]) return;
        const trackName = queue.tracks[trackIndex].title;
        const trackUrl = queue.tracks[trackIndex].url;
        queue.remove(trackIndex);

        message.reply({
            embeds: [
                {
                    description: `Removed [${trackName}](${trackUrl})`,
                    color: 0x44b868
                }
            ]
        });
	}
});
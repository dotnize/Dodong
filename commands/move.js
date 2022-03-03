const Command = require("../structures/command.js");

module.exports = new Command({
	name: "move",
    aliases: ['m'],
	description: "Moves a song to a different position in the queue",
	permission: "SEND_MESSAGES",
    options: [
        { description: 'Position of the track to move', name: 'oldposition', required: true, type: 4 },
        { description: 'New position of the track', name: 'newposition', required: true, type: 4 }
    ],
	async run(message, args, client, slash) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !args[0] || !args[1]) return;
        const trackIndex = args[0] - 1;
        if(!queue.tracks[trackIndex]) return;
        const trackName = queue.tracks[trackIndex].title;
        const trackUrl = queue.tracks[trackIndex].url;
        const track = queue.remove(trackIndex);
        queue.insert(track, args[1] - 1);
        message.reply({
            embeds: [
                {
                    description: `Moved [${trackName}](${trackUrl}) to position **${args[1]}**`,
                    color: 0x44b868
                }
            ]
        });
	}
});
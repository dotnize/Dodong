const Command = require("../structures/command.js");

module.exports = new Command({
	name: "move",
    aliases: ['m'],
	description: "Moves a song to a different position in the queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !args[1] || !args[2]) return;
        const trackIndex = args[1] - 1;
        if(!queue.tracks[trackIndex]) return;
        const trackName = queue.tracks[trackIndex].title;
        const trackUrl = queue.tracks[trackIndex].url;
        const track = queue.remove(trackIndex);
        queue.insert(track, args[2] - 1);
        message.channel.send({
            embeds: [
                {
                    description: `Moved [${trackName}](${trackUrl}) to position **${args[2]}**`,
                    color: 0x44b868
                }
            ]
        });
	}
});
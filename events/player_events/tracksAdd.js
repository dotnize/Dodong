const Event = require("../../structures/event.js");

module.exports = new Event("tracksAdd", async (player, queue, tracks) => {
    queue.metadata.channel.send({
        embeds: [
            {
                description: `Queued **${tracks.length}** tracks from [${tracks[0].playlist.title}](${tracks[0].playlist.url})`,
                color: 0x44b868
            }
        ]
    });
});
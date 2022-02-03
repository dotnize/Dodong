const Event = require("../../structures/event.js");

module.exports = new Event("trackAdd", async (player, queue, track) => {
    queue.metadata.channel.send({
        embeds: [
            {
                description: `Queued **[${track.title}](${track.url})**`,
                color: 0x44b868
            }
        ]
    });
});
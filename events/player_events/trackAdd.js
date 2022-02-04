const Event = require("../../structures/event.js");
const config = require("../../config.js");

module.exports = new Event("trackAdd", async (player, queue, track) => {
    queue.metadata.channel.send({
        embeds: [
            {
                description: `Queued **[${track.title}](${track.url})**`,
                color: 0x44b868
            }
        ]
    });

    // Webplayer
    if( player.client.hasWebplayer )
    player.client.io.to(queue.guild.id).emit("forceUpdate", {from: "music-trackAdd"});
});
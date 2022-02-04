const Event = require("../../structures/event.js");
const config = require("../../config.js");

module.exports = new Event("tracksAdd", async (player, queue, tracks) => {
    queue.metadata.channel.send({
        embeds: [
            {
                description: `Queued **${tracks.length}** tracks from [${tracks[0].playlist.title}](${tracks[0].playlist.url})`,
                color: 0x44b868
            }
        ]
    }).then( () => {
        // Webplayer Auto-Update
        if(!(player.client.isUrl(process.env.WEBPLAYER) || player.client.isUrl(config.webplayer))) return;
        player.client.io.to(queue.guild).emit("forceUpdate", {from: "music-tracksAdd"});
    });
});
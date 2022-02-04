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
    }).then( () => { // Webplayer Auto-Update
        if(!(player.client.isUrl(process.env.WEBPLAYER) || player.client.isUrl(config.webplayer))) return;
        player.client.io.to(queue.guild).emit("forceUpdate", {from: "music-trackAdd"});
    });
});
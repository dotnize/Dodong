const Event = require("../../structures/event.js");

module.exports = new Event("trackAdd", async (player, queue, track) => {
    // Webplayer
    if( player.client.hasWebplayer )
    player.client.io.to(queue.guild.id).emit("forceUpdate", {from: "music-trackAdd"});
});
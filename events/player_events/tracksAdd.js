const Event = require("../../structures/event.js");

module.exports = new Event("tracksAdd", async (player, queue, tracks) => {
    // Webplayer
    if( player.client.hasWebplayer )
    player.client.io.to(queue.guild.id).emit("forceUpdate", {from: "music-trackAdd"});
});
const Event = require("../../structures/event.js");

module.exports = new Event("trackEnd", async (player, queue, track) => {
    if(queue.npmessage && queue.npmessage.editable) {
        queue.npmessage.delete().catch(error=> {});
    }
	
    // Webplayer
    if( player.client.hasWebplayer )
    player.client.io.to(queue.guild.id).emit("forceUpdate", {from: "music-trackAdd"});
});
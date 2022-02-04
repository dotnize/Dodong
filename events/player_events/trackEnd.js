const config = require("../../config.js");
const Event = require("../../structures/event.js");

module.exports = new Event("trackEnd", async (player, queue, track) => {
    if(queue.npmessage) {
        queue.npmessage.delete().catch(error=> {});
    }

	// Webplayer Auto-Update
    if(!(player.client.isUrl(process.env.WEBPLAYER) || player.client.isUrl(config.webplayer))) return;
    player.client.io.to(queue.guild).emit("forceUpdate", {from: "music-trackEnd"});
});
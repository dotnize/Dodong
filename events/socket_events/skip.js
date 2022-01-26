const Event = require("../../structures/event.js");

module.exports = new Event("skip", (client, socket, io, args) => {
	// Arguments should be passed in a single object called arguments for "modularity"
	if(args === undefined){
		console.log(`A socket with id ${socket.id} tried to connect with invalid GUILD_ID:${args}`);
		return;
	}

    const queue = client.player.getQueue(args);
    if(!queue || !queue.playing) return;
    queue.skip();
});
const Event = require("../../structures/event.js");

module.exports = new Event("getQueue", (client, socket, io, args) => {
	// Arguments should be passed in a single object called arguments for "modularity"
	if(args === undefined){
		console.log(`A socket with id ${socket.id} tried to connect with invalid GUILD_ID:${args}`);
		return;
	}

	const guild = client.guilds.cache.get(args);
	const queue = client.player.getQueue(guild);

	if(!queue || !queue.playing){
		return;
	}

    var tracks = [];
    for(let i of queue.tracks){
        tracks.push({
            title: i.title,
            author: i.author,
            duration: i.duration,
            requestedBy: i.requestedBy
        });
    }

    io.to(socket.id).emit('recQueue', tracks);
});
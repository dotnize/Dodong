const Event = require("../../structures/event.js");

module.exports = new Event("getCurrentSong", (client, socket, io, args) => {
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

    io.to(socket.id).emit('recCurrentSong', {
		title: queue.current.title,
		author: queue.current.author,
		requestedBy: queue.current.requestedBy,
		duration: queue.current.duration,
		isPlaying: queue.playing
	});
});
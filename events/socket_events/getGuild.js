const Event = require("../../structures/event.js");

module.exports = new Event("getGuild", (client, socket, io, args) => {
	// Arguments should be passed in a single object called arguments for "modularity"
	if(args === undefined){
		console.log(`A socket with id ${socket.id} tried to connect with invalid GUILD_ID:${args}`);
		return;
	}
	const guild = client.guilds.cache.get(args);
    io.to(socket.id).emit('recGuild', JSON.stringify(guild));
});
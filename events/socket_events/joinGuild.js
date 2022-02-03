const Event = require("../../structures/event.js");

module.exports = new Event("joinGuild", async (client, socket, args) => {
	// Arguments should be passed in a single object called args for "modularity"
	if(args.guild == undefined ){
		// console.error(`INVALID_GUILD_ID: ${args.guild} - socket ID: ${socket.id}`);
		return;
	}

	socket.join(args.guild);
});
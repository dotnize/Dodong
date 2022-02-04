const Event = require("../../structures/event.js");

module.exports = new Event("joinGuild", async (client, socket, io, args) => {
	// Arguments should be passed in a single object called args for "modularity"
	if(args.guild == undefined ) return;
	socket.join(args.guild);
});
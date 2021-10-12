const Event = require("../structures/event.js");

module.exports = new Event("ready", client => {
	console.log("--------- Noize is ready! ---------");
	client.user.setActivity(`${client.prefix}help in ${client.guilds.cache.size} servers`, { type: 'LISTENING' });
});
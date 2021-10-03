const Discord = require("discord.js");
const Client = require("./client.js");

function RunFunction(client, ...eventArgs) {}

class Event {
	constructor(event, runFunction) {
		this.event = event;
		this.run = runFunction;
	}
}

module.exports = Event;

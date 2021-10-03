const Client = require("./client.js");
const Discord = require("discord.js");

function RunFunction(message, args, client) {}

class Command {
	constructor(options) {
		this.name = options.name;
		this.aliases = options.aliases || [];
		this.description = options.description;
		this.permission = options.permission;
		this.run = options.run;
	}
}

module.exports = Command;

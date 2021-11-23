const Discord = require("discord.js");
const Command = require("./command.js");
const Event = require("./event.js");
const { Player } = require("discord-player");
const { musicEvents } = require("./music.js")
const config = require("../config.js");
const fs = require("fs");
const { Lyrics } = require("@discord-player/extractor");
const Web = require("./web.js");

class Client extends Discord.Client {
	constructor() {
		config.prefix = process.env.PREFIX || config.prefix;
		config.bottoken = process.env.BOTTOKEN || config.bottoken;
		config.geniusapitoken = process.env.GENIUSAPITOKEN || config.geniusapitoken;
		config.webserver = process.env.WEBSERVER || config.webserver;

		super({	intents: [
			Discord.Intents.FLAGS.GUILDS,
			Discord.Intents.FLAGS.GUILD_MESSAGES,
			Discord.Intents.FLAGS.GUILD_VOICE_STATES
		]});

		this.commands = new Discord.Collection();
		this.player = new Player(this, {
			leaveOnEnd: false,
			leaveOnStop: false,
			leaveOnEmpty: true,
			leaveOnEmptyCooldown: 120000
		});
		this.requiredVoicePermissions = [
            "VIEW_CHANNEL",
            "CONNECT",
            "SPEAK"
        ];
		this.requiredTextPermissions = [
			"VIEW_CHANNEL",
			"SEND_MESSAGES",
			"READ_MESSAGE_HISTORY",
			"ADD_REACTIONS",
			"EMBED_LINKS"
		];
		this.prefix = config.prefix;
	}

	init(token) {
		if(config.bottoken === "BOT TOKEN HERE" || config.bottoken === "" || !config.bottoken)
			return console.error("--- ERROR: Bot token is empty! Make sure to fill this out in config.js");

		// command handler
		const commandFiles = fs.readdirSync("./commands")
			.filter(file => file.endsWith(".js"));
		const commands = commandFiles.map(file => require(`../commands/${file}`));
		let count = 0;
		commands.forEach(cmd => {
			count++;
			this.commands.set(cmd.name, cmd);
		});
		console.log(`${count} commands loaded.`);

		// event handler
		this.removeAllListeners();
		count = 0;
		fs.readdirSync("./events")
			.filter(file => file.endsWith(".js"))
			.forEach(file => {
				count++;
				const event = require(`../events/${file}`);
				this.on(event.event, event.run.bind(null, this));
			});
		console.log(`${count} events loaded.`);

		// discord-player
		musicEvents(this.player);
		this.lyrics = Lyrics.init(config.geniusapitoken);
		if(config.geniusapitoken === "GENIUS.COM CLIENT ACCESS TOKEN HERE" || config.geniusapitoken === "" || !config.geniusapitoken)
			console.log("No Genius API token provided. Lyrics feature might not work properly.");
		
		// web player
		if(config.webserver && !config.webserver.match(/off|disabled|none|false|empty/i)) {
			this.web = new Web(config.webserver);
		}

		this.login(token);
	}
}

module.exports = Client;
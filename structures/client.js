const Discord = require("discord.js");
const Command = require("./command.js");
const Event = require("./event.js");
const { Player } = require("discord-player");
const { musicEvents } = require("./music.js")
const config = require("../config.js");
const fs = require("fs");
const downloader = require("@discord-player/downloader").Downloader;
const { Lyrics } = require("@discord-player/extractor");
const { Facebook } = require("@discord-player/extractor");

class Client extends Discord.Client {
	constructor() {
		super({	intents: [
			Discord.Intents.FLAGS.GUILDS,
			Discord.Intents.FLAGS.GUILD_MESSAGES,
			Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
			Discord.Intents.FLAGS.GUILD_VOICE_STATES,
			//Discord.Intents.FLAGS.GUILD_MEMBERS // for guildMemberAdd and guildMemberRemove
		]});
		this.commands = new Discord.Collection();
		this.prefix = config.prefix;
		this.player = new Player(this, {
			leaveOnEnd: false,
			leaveOnStop: false,
			leaveOnEmpty: true,
			leaveOnEmptyCooldown: 120000
		});
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
		this.player.use("YOUTUBE_DL", downloader);
		this.player.use("facebook", Facebook);
		this.lyrics = Lyrics.init(config.geniusAPItoken);
		if(config.geniusAPItoken === "GENIUS.COM CLIENT ACCESS TOKEN HERE" || config.geniusAPItoken === "" || !config.geniusAPItoken)
			console.log("Genius API Key is empty. Lyrics feature might not work properly.");

		this.login(token);
	}
}

module.exports = Client;

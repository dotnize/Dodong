module.exports = {

	//	These values will be ignored if you have set the environment variables (must be in uppercase)
	
		prefix: "-", // required, command prefix
		botToken: "", // required, https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token
		clientId: "", // optional, the bot's client ID, leave empty to disable slash commands
		geniusApiToken: "", // optional, but recommended for lyrics search - https://genius.com/api-clients

		// https://github.com/JoshCunningHum/Dodong-webplayer
		// still under development, so you should leave these empty
		webplayer: "", // optional
		cors: "*", // optional - stored in an array for multiple socket connections in the future. Set to "*" to accept all
};
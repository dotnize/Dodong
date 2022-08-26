module.exports = {

	//	These values will be ignored if you have set the environment variables (must be in uppercase)
	
		prefix: "-", // required, command prefix
		botToken: "ODM0Njk5OTYwMzQ3NTI1MTcw.GTu3Mk.6kItKIKPdfiuPenSncdb6q9jl3WkUTJSDARISI", // required, https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-token
		clientId: "834699960347525170", // optional, the bot's client ID, leave empty to disable slash commands
		geniusApiToken: "", // optional, but recommended for lyrics search - https://genius.com/api-clients

		// https://github.com/JoshCunningHum/Dodong-webplayer
		// still under development, so you should leave these empty
		webplayer: "", // optional
		cors: "*", // optional - stored in an array for multiple socket connections in the future. Set to "*" to accept all
};
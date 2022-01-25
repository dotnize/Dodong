module.exports = {

	//	These values will be ignored if you have set the environment variables (should be in uppercase)
	
		prefix: "!",
		bottoken: "BOT TOKEN HERE",
		geniusapitoken: "GENIUS.COM CLIENT ACCESS TOKEN HERE", // optional - https://genius.com/api-clients
		cors: ["https://dodong-webplayer.herokuapp.com/"], // optional (for use with the webplayer) - stored in an array for multiple socket connections in the future. Webplayer should be first. Set to "*" for accept all
};
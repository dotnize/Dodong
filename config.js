module.exports = {

	//	These values will be ignored if you have set the environment variables (should be in uppercase)
	
		prefix: "!",
		bottoken: "BOT TOKEN HERE",
		geniusapitoken: "GENIUS.COM CLIENT ACCESS TOKEN HERE", // optional - https://genius.com/api-clients
<<<<<<< Updated upstream
	
		// Socket.io server for the web player
		webserver: "none" // e.g. http://localhost:3000
		//	set to empty or "none" if you will not use the web player
=======
		cors: ["http://localhost:8080"], // optional (for use with the webplayer) - stored in an array for multiple socket connections in the future. Webplayer should be first
>>>>>>> Stashed changes
};
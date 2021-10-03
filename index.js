const Client = require("./structures/client.js");
const config = require("./config.json");
const client = new Client();

//client.init(config.token);
client.init(process.env.BOT_TOKEN) // for heroku
const Client = require("./structures/client.js");
const config = require("./config.json");
const client = new Client();

client.init(config.bottoken);
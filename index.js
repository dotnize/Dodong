const Client = require("./structures/client.js");
const config = require("./config.js");
const client = new Client();

client.init(process.env.BOTTOKEN || config.botToken);
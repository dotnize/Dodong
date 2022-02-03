const Event = require("../../structures/event.js");

module.exports = new Event("connectionError", async (player, queue, error) => {
    console.log(`(${queue.guild.name}) connectionError: ${error.message}`);
});
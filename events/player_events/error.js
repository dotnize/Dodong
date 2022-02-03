const Event = require("../../structures/event.js");

module.exports = new Event("error", async (player, queue, error) => {
    console.log(`(${queue.guild.name}) error: ${error.message}`);
});
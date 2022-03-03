const Event = require("../../structures/event.js");

module.exports = new Event("getGuilds", async (client, socket, io, args) => {
    const guilds = client.guilds.cache.map(guild => guild.id);
    // guild IDs only

    io.to(socket.id).emit("recGuilds", guilds);
});

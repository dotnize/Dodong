const Event = require("../../structures/event.js");

module.exports = new Event("getGuilds", async (client, socket, io, args) => {
    const guilds = client.guilds.cache.map(guild => guild.id);
    // guild IDs only

    // We can't do this now, instead we pass guilds as a property of an object with the details on what connection ID between the browser and the backEnd has
    socket.emit("recGuilds", {
        guild: guilds
    });
});

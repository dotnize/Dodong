const Event = require("../../structures/event.js");

module.exports = new Event("getData", async (client, socket, io, args) => {
	// Arguments should be passed in a single object called arguments for "modularity"
	if(args.guild === undefined) return;

	const guild = client.guilds.cache.get(args.guild);

    if(!guild){
        io.to(socket.id).emit("error", {
            type: "NO_GUILD",
            guildID: args.guild
        });
        return;
    }

	const queue = client.player.getQueue(guild);

    let res = {
        guildName: guild.name,
        tracks: [],
        inVoiceChannel: false
    }

    if(queue){
        res.playing = queue.playing;
        res.repeatMode = queue.repeatMode;
        res.volume = queue.volume;

        if(queue.playing){
            res.current = {
                title: queue.current.title,
                author: queue.current.author,
                requestedBy: queue.current.requestedBy.username,
                duration: queue.current.duration,
                durationMS: queue.current.durationMS,
                progress: queue.streamTime
            }
        }

        for(let i of queue.tracks){
            res.tracks.push({
                title: i.title,
                author: i.author,
                duration: i.duration,
                requestedBy: i.requestedBy
            });
        }

        if(queue.connection){
            res.inVoiceChannel = queue.connection.channel.id;
        }
    }

    io.to(socket.id).emit("recData", res);
});
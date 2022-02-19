const { QueryType } = require("discord-player");
const Event = require("../../structures/event.js");

module.exports = new Event("play", async (client, socket, io, args) => {
	// Arguments should be passed in a single object called arguments for "modularity"
	if(args.guild == undefined) return;
	

	const guild = client.guilds.cache.get(args.guild);
    const lastQueueChannel = client.player.getQueue(args.guild).metadata.channel;

    if(!lastQueueChannel){
        console.log("play.js - No channel in queue.metadata");
        return;
    }

    const searchResult = await client.player.search(args.query, { requestedBy: client.user , searchEngine: QueryType.AUTO});

    if(!searchResult || !searchResult.tracks.length){
        io.to(socket.id).emit("error", "No Result Found");
    }

    const queue = await client.player.createQueue(guild, { metadata: { channel: lastQueueChannel },
        bufferingTimeout: 1000,
        disableVolume: false,
        leaveOnEnd: true,
        leaveOnStop: true,

        async onBeforeCreateStream(track, source, _queue){
            let vid;
            try{
                if(track.url.includes("youtube.com"))
                    vid = (await playdl.stream(track.url, { discordPlayerCompatibility : true })).stream;
                else
                    vid = (await playdl.stream(await playdl.search(`${track.author} ${track.title} lyric`, { limit : 1, source : { youtube : "video" } }).then(x => x[0].url), { discordPlayerCompatibility : true })).stream;
            } catch {
                io.to(socket.id).emit("error", "Error occured while attempting to play : [" + track.title + "](" + track.url + ").");
                vid = (await playdl.stream("https://www.youtube.com/watch?v=Wch3gJG2GJ4", { quality: 0, discordPlayerCompatibility : true })).stream; // the 1 second video
            }
            return vid;
        }
    });
    let justConnected, voiceChannel;

    voiceChannel = guild.channels.cache.find(ch => {
        ch.id == args.voiceChannelID
    });

    try { 
        if(!queue.connection){
            justConnected = true;
            await queue.connect(voiceChannel);
        }
    } catch {
        client.player.deleteQueue(guild);
        io.to(socket.id).emit("error", "Can't join the voice channel selected");
        return;
    }

    let embed = {};
    if(searchResult.playlist) {
        embed = {
            description: `Queued **${searchResult.tracks.length}** tracks from [${searchResult.tracks[0].playlist.title}](${searchResult.tracks[0].playlist.url})`,
            color: 0x44b868
        };
        queue.addTracks(searchResult.tracks);
    } else {
        embed = {
            description: `Queued **[${searchResult.tracks[0].title}](${searchResult.tracks[0].url})**`,
            color: 0x44b868
        };
        queue.addTrack(searchResult.tracks[0]);
    }
    lastQueueChannel.send({ embeds: [embed] });

    if(justConnected) queue.play();
});
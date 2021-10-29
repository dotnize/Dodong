const Command = require("../structures/command.js");
const { QueryType } = require('discord-player');
const playdl = require("play-dl");

module.exports = new Command({
	name: "play",
    aliases: ['p'],
	description: "Plays the song specified",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        if(!message.member.voice.channelId)
            return message.reply({ embeds: [{ description: `You are not in a voice channel!`, color: 0xb84e44 }] });
        if(message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
            return message.reply({ embeds: [{ description: `You are not in my voice channel!`, color: 0xb84e44 }] });
        if(!args[1]) {
            const queue = client.player.getQueue(message.guild);
            if(queue && queue.playing) { // resume
                const paused = queue.setPaused(false);
                if(paused) message.react('▶️');
            }
            return;
        }

        let query = args.slice(1).join(" ");
        let queryType;
        if(query.includes("youtube.com/playlist")) {
            queryType = QueryType.YOUTUBE_PLAYLIST;
            query = query.concat(" a"); // for some reason, youtube playlist links won't work unless there's extra text in the query
        }
        else if(query.includes("open.spotify.com/playlist"))
            queryType = QueryType.SPOTIFY_PLAYLIST;
        else if(query.includes("open.spotify.com/album"))
            queryType = QueryType.SPOTIFY_ALBUM;
        else
            queryType = QueryType.AUTO;

        const searchResult = await client.player.search(query, { requestedBy: message.author, searchEngine: queryType })
        if (!searchResult || !searchResult.tracks.length)
            return message.channel.send({ embeds: [{ description: `No results found!`, color: 0xb84e44 }] });

        const queue = await client.player.createQueue(message.guild,{ metadata: { channel: message.channel },
            async onBeforeCreateStream(track, source, _queue) {
                if (track.url.includes("youtube.com")) {
                    return (await playdl.stream(track.url, { quality : 0 })).stream;
                }
                else {
                    // temporary since onBeforeCreateStream crashes the bot if we return void
                    const yt = await playdl.search(`${track.author} ${track.title} lyric`, { limit : 1, source : { youtube : "video" } }).then(x => x[0].url);
                    console.log(yt);
                    return (await playdl.stream(yt, { quality: 0 })).stream;
                }
            }
        });
        let justConnected;
        try {
            if (!queue.connection) {
                justConnected = true;
                await queue.connect(message.member.voice.channel);
            }
        } catch {
            client.player.deleteQueue(message.guild);
            return message.channel.send({ embeds: [{ description: `Could not join your voice channel!`, color: 0xb84e44 }] });
        }
        if(searchResult.playlist) searchResult.tracks[0].playlist = searchResult.playlist;
        await searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if(justConnected) queue.play();
	}
});
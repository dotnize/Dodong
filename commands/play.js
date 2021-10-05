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
            return message.reply({ content: "You are not in a voice channel!" });
        if(message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
            return message.reply({ content: "You are not in my voice channel!" });
        if(!args[1]) {
            const queue = client.player.getQueue(message.guild);
            if(queue && queue.playing) { // resume
                const paused = queue.setPaused(false);
                if(paused) message.react('▶️');
            }
            return;
        }

        let query = args.slice(1).join(" ");
        if(query.includes("spotify.com")) {
            return message.channel.send({ embeds: [{ description: `Spotify tracks are temporarily disabled due to a [bug](https://github.com/nizeic/Noize/issues/2).`, color: 0xff0000 }] });
        }
        message.channel.send({ content: '🎵  Searching 🔎 `'+query+'`' })
        
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
            return message.channel.send({ embeds: [{ description: `No results found!`, color: 0xff0000 }] });

        const queue = await client.player.createQueue(message.guild,{ metadata: { channel: message.channel },
            async onBeforeCreateStream(track, source, _queue) {
                if (source === "youtube") {
                    return (await playdl.stream(track.url)).stream;
                }
            }
        });

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            client.player.deleteQueue(message.guild);
            return message.reply({ content: 'Could not join your voice channel!' });
        }

        await searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) queue.play();
	}
});
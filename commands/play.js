const Command = require("../structures/command.js");
const { QueryType } = require('discord-player');

module.exports = new Command({
	name: "play",
    aliases: ['p'],
	description: "Plays the song specified",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        if (!message.member.voice.channelId) return message.reply({ content: "You are not in a voice channel!", ephemeral: true });
        if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId) return message.reply({ content: "You are not in my voice channel!", ephemeral: true });

        var query = args.slice(1).join(" ");
        if(!query) {
            const queue = client.player.getQueue(message.guild);
            if(queue && queue.playing) {
                const paused = queue.setPaused(false);
                if(paused) message.react('▶️');
            }
            return;
        }
        message.channel.send({ content: '🎵  Searching 🔎 `'+query+'`' })
        var querytype;
        if(query.includes("youtube.com/playlist")) {
            querytype = QueryType.YOUTUBE_PLAYLIST;
            query = query.concat(" a"); // for some reason, youtube playlist links won't work unless there's extra text in the query
        }
        else if(query.includes("open.spotify.com/playlist"))
            querytype = QueryType.SPOTIFY_PLAYLIST;
        else if(query.includes("open.spotify.com/album"))
            querytype = QueryType.SPOTIFY_ALBUM;
        else
            querytype = QueryType.AUTO;
        const searchResult = await client.player
            .search(query, {
                requestedBy: message.author,
                searchEngine: querytype
            })
            .catch(() => {
                console.log('eeeeeeeeeee');
            });
        if (!searchResult || !searchResult.tracks.length) return void message.channel.send({
            embeds: [
                {
                    description: `No results found!`,
                    color: 0xff0000
                }
            ]
        });
        const queue = await client.player.createQueue(message.guild, {
            metadata: {
                channel: message.channel
            }
        });
        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            void client.player.deleteQueue(message.guild);
            return void message.reply({ content: 'Could not join your voice channel!' });
        }
        await searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) queue.play();
	}
});
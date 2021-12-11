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
        
        if(!message.guild.me.permissionsIn(message.member.voice.channel).has(client.requiredVoicePermissions)) return;

        let query = args.slice(1).join(" ");
        const searchResult = await client.player.search(query, { requestedBy: message.author, searchEngine: QueryType.AUTO })
        if (!searchResult || !searchResult.tracks.length)
            return message.channel.send({ embeds: [{ description: `No results found!`, color: 0xb84e44 }] });

        const queue = await client.player.createQueue(message.guild,{ metadata: { channel: message.channel },

            bufferingTimeout: 1000,
            disableVolume: false, // disabling volume controls can improve performance
            leaveOnEnd: true,
			leaveOnStop: true,
			//leaveOnEmpty: true,
			//leaveOnEmptyCooldown: 300000,

            async onBeforeCreateStream(track, source, _queue) {
                let vid;
                try {
                    if(track.url.includes("youtube.com"))
                        vid = (await playdl.stream(track.url)).stream;
                    else
                        vid = (await playdl.stream(await playdl.search(`${track.author} ${track.title} lyric`, { limit : 1, source : { youtube : "video" } }).then(x => x[0].url))).stream;
                } catch {
                    queue.metadata.channel.send({ embeds: [{ description: `An error occurred while attempting to play [${track.title}](${track.url}).`, color: 0xb84e44 }] });
                    vid = (await playdl.stream("https://www.youtube.com/watch?v=Wch3gJG2GJ4", { quality: 0 })).stream; // a 1 second video. if u have a better way to do this, feel free to open a PR/issue :)
                }
                return vid;
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

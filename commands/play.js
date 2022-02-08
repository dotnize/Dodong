const Command = require("../structures/command.js");
const { QueryType } = require('discord-player');
const playdl = require("play-dl");

module.exports = new Command({
	name: "play",
    aliases: ['p'],
	description: "Plays the song specified",
	permission: "SEND_MESSAGES",
    options: [
        { description: 'URL or song name', name: 'song', required: true, type: 3 }
    ],
	async run(message, args, client, slash) {
        if(!message.member.voice.channelId)
            return message.reply({ embeds: [{ description: `You are not in a voice channel!`, color: 0xb84e44 }], ephemeral: true });
        if(message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
            return message.reply({ embeds: [{ description: `You are not in my voice channel!`, color: 0xb84e44 }], ephemeral: true });
        if(!args[0]) return;
        
        if(!message.guild.me.permissionsIn(message.member.voice.channel).has(client.requiredVoicePermissions)) return;

        if(slash) await message.deferReply();
        let query = slash ? args[0].value : args.slice(0).join(" ");
        const searchResult = await client.player.search(query, { requestedBy: slash ? message.user : message.author, searchEngine: QueryType.AUTO })
        if (!searchResult || !searchResult.tracks.length)
            return message.reply({ embeds: [{ description: `No results found!`, color: 0xb84e44 }], ephemeral: true });
        
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
                        vid = (await playdl.stream(track.url, { discordPlayerCompatibility : true })).stream;
                    else
                        vid = (await playdl.stream(await playdl.search(`${track.author} ${track.title} lyric`, { limit : 1, source : { youtube : "video" } }).then(x => x[0].url), { discordPlayerCompatibility : true })).stream;
                } catch {
                    queue.metadata.channel.send({ embeds: [{ description: `An error occurred while attempting to play [${track.title}](${track.url}).`, color: 0xb84e44 }] });
                    vid = (await playdl.stream("https://www.youtube.com/watch?v=Wch3gJG2GJ4", { quality: 0, discordPlayerCompatibility : true })).stream; // a 1 second video. if u have a better way to do this, feel free to open a PR/issue :)
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
            return message.reply({ embeds: [{ description: `Could not join your voice channel!`, color: 0xb84e44 }] });
        }
        await searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if(justConnected) queue.play();
	}
});

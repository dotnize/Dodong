const Command = require("../structures/command.js");

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
            return message.reply({ embeds: [{ description: `You are not in a voice channel!`, color: 0xb84e44 }], ephemeral: true, failIfNotExists: false });
        if(message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId)
            return message.reply({ embeds: [{ description: `You are not in my voice channel!`, color: 0xb84e44 }], ephemeral: true, failIfNotExists: false });
        if(!args[0]) return;
        
        if(!message.guild.members.me.permissionsIn(message.member.voice.channel).has(client.requiredVoicePermissions)) return;

        if(slash) await message.deferReply();
        let query = args.join(" "), reply = {};
        const searchResult = await client.player.search(query, { requestedBy: slash ? message.user : message.author, searchEngine: "dodong" })
        if (!searchResult || !searchResult.tracks.length) {
            reply = { embeds: [{ description: `No results found!`, color: 0xb84e44 }], ephemeral: true, failIfNotExists: false };
            slash ? message.editReply(reply) : message.reply(reply);
            return;
        }
        const queue = await client.player.createQueue(message.guild,{ metadata: { channel: message.channel },

            bufferingTimeout: 1000,
            disableVolume: false, // disabling volume controls can improve performance
            leaveOnEnd: true,
			leaveOnStop: true,
            spotifyBridge: false
			//leaveOnEmpty: true, // not working for now, discord-player issue
			//leaveOnEmptyCooldown: 300000,
        });
        let justConnected;
        try {
            if (!queue.connection) {
                justConnected = true;
                await queue.connect(message.member.voice.channel);
            }
        } catch {
            client.player.deleteQueue(message.guild);
            reply = { embeds: [{ description: `Could not join your voice channel!`, color: 0xb84e44 }], failIfNotExists: false };
            slash ? message.editReply(reply) : message.reply(reply);
            return;
        }
        
        if(searchResult.playlist) {
            reply = { embeds: [{
                description: `Queued **${searchResult.tracks.length}** tracks from [${searchResult.tracks[0].playlist.title}](${searchResult.tracks[0].playlist.url})`,
                color: 0x44b868
            }], failIfNotExists: false };
            queue.addTracks(searchResult.tracks);
        } else {
            reply = { embeds: [{
                description: `Queued **[${searchResult.tracks[0].title}](${searchResult.tracks[0].url})**`,
                color: 0x44b868
            }], failIfNotExists: false };
            queue.addTrack(searchResult.tracks[0]);
        }
        slash ? message.editReply(reply) : message.reply(reply);

        if(justConnected) queue.play();
	}
});

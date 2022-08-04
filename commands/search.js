const Command = require("../structures/command.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = new Command({
	name: "search",
    aliases: ['s'],
	description: "Searches for a song",
	permission: "SEND_MESSAGES",
    options: [
        { description: 'Song name', name: 'song', required: true, type: 3 }
    ],
	async run(message, args, client, slash) {
        if(!message.member.voice.channelId)
            return message.reply({ embeds: [{ description: `You are not in a voice channel!`, color: 0xb84e44 }], ephemeral: true, failIfNotExists: false });
        if(message.guild.members.me.voice.channelId && message.member.voice.channelId !== message.guild.members.me.voice.channelId)
            return message.reply({ embeds: [{ description: `You are not in my voice channel!`, color: 0xb84e44 }], ephemeral: true, failIfNotExists: false });
        if(!args[0]) return;
        
        if(!message.guild.members.me.permissionsIn(message.member.voice.channel).has(client.requiredVoicePermissions)) return;

        if(slash) await message.deferReply();
        let query = args.join(" ");
        const searchResult = await client.player.search(query, { requestedBy: slash ? message.user : message.author, searchEngine: "dodong" })
        if (!searchResult || !searchResult.tracks.length) {
            const reply = { embeds: [{ description: `No results found!`, color: 0xb84e44 }], ephemeral: true, failIfNotExists: false };
            slash ? message.editReply(reply) : message.reply(reply);
            return;
        }     
		if (searchResult.playlist) {
			const reply = { embeds: [{ description: `This command does not support playlists.\nUse **${client.prefix}play** instead.`, color: 0xb84e44 }], ephemeral: true, failIfNotExists: false };
            slash ? message.editReply(reply) : message.reply(reply);
            return;
		}
		const buttons = [];
		const embeds = [];
		for(let i = 0; i < searchResult.tracks.length; i++) {
			
			const button = new ButtonBuilder()
            .setCustomId(`search_${i}`)
            .setLabel(`${i+1}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(false);
			buttons.push(button);

			embeds.push({
				thumbnail: {
					url: `${searchResult.tracks[i].thumbnail}`
				},
				description: `**${i+1}.** [${searchResult.tracks[i].title}](${searchResult.tracks[i].url})\n${searchResult.tracks[i].author} - ${searchResult.tracks[i].duration}`,
				color: 0x44b868
			});
		}
		const row = new ActionRowBuilder().addComponents(buttons);

		const msg = slash ? await message.editReply({ embeds: embeds, components: [row] }) : await message.reply({ embeds: embeds, components: [row], failIfNotExists: false });
		const sMessage = slash ? await message.fetchReply() : msg;

		const filter = (button) => button.customId.startsWith('search_');
		const collector = await sMessage.createMessageComponentCollector({ filter, time: 30000 });

		collector.on("collect", async (button) => {
			if(button.member !== message.member) return;
			await button.deferUpdate();
			const queue = await client.player.createQueue(message.guild,{ metadata: { channel: message.channel },
				bufferingTimeout: 1000,
				disableVolume: false,
				leaveOnEnd: true,
				leaveOnStop: true,
				spotifyBridge: false
			});
			let justConnected;
			try {
				if (!queue.connection) {
					justConnected = true;
					await queue.connect(message.member.voice.channel);
				}
			} catch {
				client.player.deleteQueue(message.guild);
				sMessage.edit({ embeds: [{ description: `Could not join your voice channel!`, color: 0xb84e44 }], components: [] });
				return collector.stop("messageDelete");
			}

			queue.addTrack(searchResult.tracks[parseInt(button.customId.split("_").pop())]);
			sMessage.edit({
				embeds: [{
					description: `Queued **[${searchResult.tracks[parseInt(button.customId.split("_").pop())].title}](${searchResult.tracks[parseInt(button.customId.split("_").pop())].url})**`,
					color: 0x44b868
				}],
				components: []
			});
			if(justConnected) queue.play();
			collector.stop("messageDelete");
		});
	
		collector.on("end", (_, reason) => {
			if(reason !== "messageDelete" && sMessage.editable) {
				row.setComponents(buttons.map(b => b.setDisabled(true)));
				sMessage.edit({
					embeds: embeds,
					components: [row]
				}).catch(error=> {});
			}
		});
	}
});

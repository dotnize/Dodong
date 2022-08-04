const Command = require("../structures/command.js");
const { QueueRepeatMode } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
module.exports = new Command({
	name: "loop",
    aliases: ['repeat'],
	description: "Loops the server queue",
	permission: "SEND_MESSAGES",
    options: [
        { description: 'Loop mode to set', name: 'mode', type: 3 }
    ],
	async run(message, args, client, slash) {
        const queue = client.player.getQueue(message.guild);
        if (!queue) return;
        if(args.length === 0) {
            if(await queue.repeatMode === QueueRepeatMode.OFF || await queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
                return message.reply({ embeds: [{ description: `🔄 | Looping the **queue**.`, color: 0x44b868}] });
            }
            else if(await queue.repeatMode === QueueRepeatMode.QUEUE) {
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                return message.reply({ embeds: [{ description: `🔂 | Looping the **current track**.`, color: 0x44b868}] });
            }
            else if(await queue.repeatMode === QueueRepeatMode.TRACK) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                return message.reply({ embeds: [{ description: `✅ | Loop is now **disabled**.`, color: 0x44b868}] });
            }
        }
        if(args.includes("off") || args.includes("disable") || args.includes("none")) { 
            queue.setRepeatMode(QueueRepeatMode.OFF);
            slash ? message.reply({embeds: [{ description: `✅ Loop is now disabled.`, color: 0x44b868 }]}) : message.react("✅");
        }
        else if(args.includes("track") || args.includes("song") || args.includes("current")) {
            queue.setRepeatMode(QueueRepeatMode.TRACK);
            slash ? message.reply({embeds: [{ description: `🔂 Looping the current track.`, color: 0x44b868 }]}) : message.react("🔂");
        }
        else if(args.includes("queue") || args.includes("all")) {
            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            slash ? message.reply({embeds: [{ description: `🔄 Looping the queue.`, color: 0x44b868}] }) : message.react("🔄");
        }
        else if(args.includes("autoplay")){
            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            slash ? message.reply({embeds: [{ description: `▶️ Autoplay has been enabled.`, color: 0x44b868}] }) : message.react("▶️");
        }
        else {
            const embed = new EmbedBuilder()
            embed.setColor('#44b868');
            let mode;
            if(await queue.repeatMode === QueueRepeatMode.OFF) mode = "`Off`";
            else if(await queue.repeatMode === QueueRepeatMode.TRACK) mode = "`Track`";
            else if(await queue.repeatMode === QueueRepeatMode.QUEUE) mode = "`Queue`";
            else if(await queue.repeatMode === QueueRepeatMode.AUTOPLAY) mode = "`Autoplay`";
			embed.setDescription(`Current loop mode: ${mode}\nOptions: off, track, queue, autoplay`);
            message.reply({embeds: [embed]});
        }
	}
});
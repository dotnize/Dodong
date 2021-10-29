const Command = require("../structures/command.js");
const { QueueRepeatMode } = require('discord-player');
const { MessageEmbed } = require('discord.js');
module.exports = new Command({
	name: "loop",
    aliases: ['repeat'],
	description: "Loops the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue) return;
        if(!args[1]) {
            if(await queue.repeatMode === QueueRepeatMode.OFF || await queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
                return message.channel.send({ embeds: [{ description: `🔄 | Looping the **queue**.`, color: 0x44b868}] });
            }
            else if(await queue.repeatMode === QueueRepeatMode.QUEUE) {
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                return message.channel.send({ embeds: [{ description: `🔂 | Looping the **current track**.`, color: 0x44b868}] });
            }
            else if(await queue.repeatMode === QueueRepeatMode.TRACK) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                return message.channel.send({ embeds: [{ description: `✅ | Looping is now **disabled**.`, color: 0x44b868}] });
            }
        }
        const option = args[1];
        if(option.includes("off") || option.includes("disable") || option.includes("none")) { 
            queue.setRepeatMode(QueueRepeatMode.OFF);
            return message.react("✅");
        }
        else if(option.includes("track") || option.includes("song") || option.includes("current")) {
            queue.setRepeatMode(QueueRepeatMode.TRACK);
            return message.react("🔂");
        }
        else if(option.includes("queue") || option.includes("all")) {
            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            return message.react("🔄");
        }
        else if(option.includes("autoplay")){
            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            return message.react("▶️");
        }
        else {
            const embed = new MessageEmbed()
            embed.setColor('#44b868');
            let mode;
            if(await queue.repeatMode === QueueRepeatMode.OFF) mode = "`Off`";
            else if(await queue.repeatMode === QueueRepeatMode.TRACK) mode = "`Track`";
            else if(await queue.repeatMode === QueueRepeatMode.QUEUE) mode = "`Queue`";
            else if(await queue.repeatMode === QueueRepeatMode.AUTOPLAY) mode = "`Autoplay`";
			embed.setDescription(`Current loop mode: ${mode}\nOptions: off, track, queue, autoplay`);
            message.channel.send({embeds: [embed]});
        }
	}
});
const Command = require("../structures/command.js");
const { MessageEmbed } = require('discord.js');
module.exports = new Command({
	name: "nowplaying",
    aliases: ['np'],
	description: "Displays information about the song currently playing",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) {
            const embed = new MessageEmbed();
            embed.setDescription(`no songs are currently playing`);
            return message.reply({ embeds: [embed] });
        }
        const progress = queue.createProgressBar({ timecodes: true, length: 8 });

        return message.channel.send({
            embeds: [
                {
                    title: '🎵 | Now Playing',
                    description: `**[${queue.current.title}](${queue.current.url})**`,
                    thumbnail: {
                        url: `${queue.current.thumbnail}`
                    },
                    footer: {
                        text: `queued by ${queue.current.requestedBy.tag}`
                    },
                    fields: [
                        {
                            name: '\u200b',
                            value: progress.replace(/ 0:00/g, ' ◉ LIVE')
                        }
                    ],
                    color: 0xffffff
                }
            ]
        });
	}
});
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
            embed.setColor('#b84e44');
            embed.setDescription(`There's nothing currently playing in the server.`);
            return message.reply({ embeds: [embed] });
        }
        const progress = queue.createProgressBar({ timecodes: true, length: 8 });

        return message.channel.send({
            embeds: [
                {
                    description: `**[${queue.current.title}](${queue.current.url})** - ${queue.current.requestedBy}`,
                    thumbnail: {
                        url: `${queue.current.thumbnail}`
                    },
                    fields: [
                        {
                            name: '\u200b',
                            value: progress.replace(/ 0:00/g, ' ◉ LIVE')
                        }
                    ],
                    color: 0x44b868
                }
            ]
        });
	}
});
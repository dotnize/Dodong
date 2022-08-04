const Command = require("../structures/command.js");
const { EmbedBuilder } = require('discord.js');
module.exports = new Command({
	name: "nowplaying",
    aliases: ['np'],
	description: "Displays information about the song currently playing",
	permission: "SEND_MESSAGES",
	async run(message, args, client, slash) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder();
            embed.setColor('#b84e44');
            embed.setDescription(`There's nothing currently playing in the server.`);
            return message.reply({ embeds: [embed] });
        }
        const progress = queue.createProgressBar({ timecodes: true, length: 8 });

        const title = ['spotify-custom', 'soundcloud-custom'].includes(queue.current.source) ?
             `${queue.current.author} - ${queue.current.title}` : `${queue.current.title}`;

        return message.reply({
            embeds: [
                {
                    description: `**[${title}](${queue.current.url})** - ${queue.current.requestedBy}`,
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
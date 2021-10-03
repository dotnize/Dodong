const Command = require("../structures/command.js");
const paginationEmbed = require('discordjs-button-pagination');
const { MessageEmbed, MessageButton } = require('discord.js');

module.exports = new Command({
	name: "queue",
    aliases: ['q'],
	description: "Displays the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        
        const queue = client.player.getQueue(message.guild);
        if (!queue) {
            const embed = new MessageEmbed();
            embed.setTitle('Server Queue');
            embed.setDescription(`no songs in the queue :<`);
            return message.channel.send({ embeds: [embed] });
        }
        const previous = new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Previous')
                .setStyle('DANGER');
        const next = new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Next')
                .setStyle('SUCCESS');
        const buttons = [
            previous,
            next
        ];
        const pages = [];
        var page = 1;
        var emptypage = false;
        do {
            const pageStart = 10 * (page - 1);
            const pageEnd = pageStart + 10;
            const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
                return `**${i + pageStart + 1}**. [${m.title}](${m.url}) ${m.duration} - **${m.requestedBy.tag}**`;
            });
            if(tracks.length) {
                const embed = new MessageEmbed();
                embed.setTitle('Server Queue');
                embed.setDescription(`${tracks.join('\n')}${
                    queue.tracks.length > pageEnd
                        ? `\n... ${queue.tracks.length - pageEnd} more track(s)`
                        : ''
                }`);
                if(page === 1) embed.setAuthor(`Now playing: ${queue.current.title}`, null, `${queue.current.url}`);
                pages.push(embed);
                page++;
            }
            else  {
                emptypage = 1;
                if(page === 1) {
                    const embed = new MessageEmbed();
                    embed.setTitle('Server Queue');
                    embed.setDescription(`no songs in the queue :<`);
                    embed.setAuthor(`Now playing: ${queue.current.title}`, null, `${queue.current.url}`);
                    return message.channel.send({ embeds: [embed] });
                }
            }
        } while(!emptypage);
        return paginationEmbed(message, pages, buttons, 30000);
	}
});
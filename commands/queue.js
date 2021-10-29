const Command = require("../structures/command.js");
const paginationEmbed = require('discordjs-button-pagination');
const { MessageEmbed, MessageButton } = require('discord.js');

module.exports = new Command({
	name: "queue",
    aliases: ['q'],
	description: "Displays the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client, _fromButton = false) {
        
        const queue = client.player.getQueue(message.guild);
        if (!queue) {
            if(_fromButton) return;
            const embed = new MessageEmbed();
            embed.setTitle('Server Queue');
            embed.setColor('#b84e44');
            embed.setDescription(`no songs in the queue :<`);
            return message.channel.send({ embeds: [embed] });
        }
        let usedby;
        if(_fromButton)
            usedby = message.user;
        else
            usedby = "";

        const buttons = [
            new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Previous')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Next')
                .setStyle('SUCCESS')
        ];
        const pages = [];
        let page = 1;
        let emptypage = false;
        do {
            const pageStart = 10 * (page - 1);
            const pageEnd = pageStart + 10;
            const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
                return `**${i + pageStart + 1}**. [${m.title}](${m.url}) ${m.duration} - ${m.requestedBy}`;
            });
            if(tracks.length) {
                const embed = new MessageEmbed();
                embed.setDescription(`${usedby}\n${tracks.join('\n')}${
                    queue.tracks.length > pageEnd
                        ? `\n... ${queue.tracks.length - pageEnd} more track(s)`
                        : ''
                }`);
                if(page%2 === 0) embed.setColor('#b84e44');
                else embed.setColor('#44b868');
                if(page === 1) embed.setAuthor(`Now playing: ${queue.current.title}`, null, `${queue.current.url}`);
                pages.push(embed);
                page++;
            }
            else  {
                emptypage = 1;
                if(page === 1) {
                    const embed = new MessageEmbed();
                    embed.setColor('#44b868');
                    embed.setDescription(`${usedby}\nno songs in the queue :<`);
                    embed.setAuthor(`Now playing: ${queue.current.title}`, null, `${queue.current.url}`);
                    return message.channel.send({ embeds: [embed] });
                }
                if(page === 2) {
                    return message.channel.send({ embeds: [pages[0]] });
                }
            }
        } while(!emptypage);
        return paginationEmbed(message, pages, buttons, 30000);
	}
});
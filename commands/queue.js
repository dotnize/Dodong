const Command = require("../structures/command.js");
const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');

module.exports = new Command({
	name: "queue",
    aliases: ['q'],
	description: "Displays the server queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client, _fromButton = false) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.current) {
            if(_fromButton) return;
            const embed = new MessageEmbed();
            embed.setTitle('Server Queue');
            embed.setColor('#b84e44');
            embed.setDescription(`No songs in the queue.`);
            return message.channel.send({ embeds: [embed] });
        }
        let usedby = _fromButton ? message.member : ""; // should test first

        const buttons = [
            new MessageButton()
                .setCustomId('first')
                .setLabel('<<')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('previous')
                .setLabel('<')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('next')
                .setLabel('>')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('last')
                .setLabel('>>')
                .setStyle('SECONDARY')
        ];
        const row = new MessageActionRow().addComponents(buttons);

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
                if(page === 1) embed.setAuthor({ name: `Now playing: ${queue.current.title}`, iconURL: null, url: `${queue.current.url}` });
                pages.push(embed);
                page++;
            }
            else  {
                emptypage = true;
                if(page === 1) {
                    const embed = new MessageEmbed();
                    embed.setColor('#44b868');
                    embed.setDescription(`${usedby}\nNo more songs in the queue.`);
                    embed.setAuthor({ name: `Now playing: ${queue.current.title}`, iconURL: null, url: `${queue.current.url}` });
                    return message.channel.send({ embeds: [embed] });
                }
                if(page === 2) {
                    return message.channel.send({ embeds: [pages[0]] });
                }
            }
        } while(!emptypage);

        let currentPage = 0;
        const queueList = await message.channel.send({
            embeds: [pages[currentPage].setFooter({ text: `Page ${currentPage+1}/${pages.length}` })],
            components: [row]
        });
        const filter = (button) => button.customId === 'first' || 'previous' || 'next' || 'last';
        const collector = await queueList.createMessageComponentCollector({ filter, time: 40000 });

        collector.on("collect", async (button) => {
            switch(button.customId) {
                case 'first':
                    currentPage = 0;
                    break;
                case 'previous':
                    currentPage = currentPage > 0 ? --currentPage : pages.length-1;
                    break;
                case 'next':
                    currentPage = currentPage+1 < pages.length ? ++currentPage : 0;
                    break;
                case 'last':
                    currentPage = pages.length-1;
                    break;
            }
            switch(currentPage) {
                case 0:
                    row.setComponents(buttons[0].setDisabled(true), buttons[1].setDisabled(true), buttons[2].setDisabled(false), buttons[3].setDisabled(false));
                    break;
                case pages.length-1:
                    row.setComponents(buttons[0].setDisabled(false), buttons[1].setDisabled(false), buttons[2].setDisabled(true), buttons[3].setDisabled(true));
                    break;
                default:
                    row.setComponents(buttons[0].setDisabled(false), buttons[1].setDisabled(false), buttons[2].setDisabled(false), buttons[3].setDisabled(false));
                    break;
            }
            queueList.edit({
                embeds: [pages[currentPage].setFooter({ text: `Page ${currentPage+1}/${pages.length}` })],
                components: [row]
            });
            collector.resetTimer();
            await button.deferUpdate();
        });

        collector.on("end", (_, reason) => {
            if(reason === "time") {
                row.setComponents(buttons[0].setDisabled(true), buttons[1].setDisabled(true), buttons[2].setDisabled(true), buttons[3].setDisabled(true));
                queueList.edit({
                    embeds: [pages[currentPage].setFooter({ text: `Page ${currentPage+1}/${pages.length}` })],
                    components: [row]
                }).catch(error=> {});
            }
        });

	}
});
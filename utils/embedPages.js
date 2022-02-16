const { MessageActionRow, MessageButton, CommandInteraction } = require('discord.js');

module.exports = async (source, pages, options) => {

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

    let currentPage = 0;
    let content = {
        embeds: [pages[currentPage].setFooter({ text: `Page ${currentPage+1}/${pages.length}` })],
        components: [row]
    }
    
    const message = options.fromButton ? await source.channel.send(content) : await source.reply(content);
    const queueList = source instanceof CommandInteraction && !options.fromButton ? await source.fetchReply() : message;

    const filter = (button) => button.customId === 'first' || 'previous' || 'next' || 'last';
    const collector = await queueList.createMessageComponentCollector({ filter, time: options.timeout });

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
        if(reason !== "messageDelete" && queueList.editable) {
            row.setComponents(buttons[0].setDisabled(true), buttons[1].setDisabled(true), buttons[2].setDisabled(true), buttons[3].setDisabled(true));
            queueList.edit({
                embeds: [pages[currentPage].setFooter({ text: `Page ${currentPage+1}/${pages.length}` })],
                components: [row]
            }).catch(error=> {});
        }
    });
    return queueList;
};
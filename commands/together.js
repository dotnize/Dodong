const Command = require("../structures/command.js");
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = new Command({
	name: "together",
	aliases: ['t'],
	description: "Discord Together!",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        if(!message.member.voice.channel)
			return message.channel.send({ embeds: [{ description: `You must be in a voice channel.`, color: 0xb84e44 }] });

		const row = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('together')
				.setPlaceholder('Choose an activity')
				.setMinValues(1)
				.setMaxValues(1)
				.addOptions([
					{
						label: 'YouTube',
						value: 'youtube',
					},
					{
						label: 'Poker',
						value: 'poker',
					},
					{
						label: 'Chess',
						value: 'chess',
					},
					{
						label: 'Betrayal',
						value: 'betrayal',
					},
					{
						label: 'Fishington',
						value: 'fishing',
					},
					{
						label: 'Words Snack',
						value: 'wordsnack',
					},
					{
						label: 'Doodle Crew',
						value: 'doodlecrew',
					},
					{
						label: 'Spellcast',
						value: 'spellcast',
					},
					{
						label: 'Awkword',
						value: 'awkword',
					},
				]),
		);
		message.channel.send({ 
			embeds: [
				{
					author: {
						name: "Discord Together",
						iconURL: message.guild.iconURL()
					},
					description: `Choose an activity below`,
					footer: {
						text: 'You must be in a voice channel and on a desktop to use this feature.'
					},
					color: 0x44b868
				}
			],
			components: [row]
		});
	}
});
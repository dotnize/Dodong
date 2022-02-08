const Command = require("../structures/command.js");
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = new Command({
	name: "together",
	aliases: ['t', 'party', 'partygames'],
	description: "Discord Together!",
	permission: "SEND_MESSAGES",
	async run(message, args, client, slash) {
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
						value: '880218394199220334'
					},
					{
						label: 'Poker',
						value: '755827207812677713'
					},
					{
						label: 'Chess',
						value: '832012774040141894'
					},
					{
						label: 'Checkers',
						value: '832013003968348200'
					},
					{
						label: 'Betrayal',
						value: '773336526917861400'
					},
					{
						label: 'Fishington',
						value: '814288819477020702'
					},
					{
						label: 'Words Snack',
						value: '879863976006127627'
					},
					{
						label: 'Doodle Crew',
						value: '878067389634314250'
					},
					{
						label: 'Spellcast',
						value: '852509694341283871'
					},
					{
						label: 'Awkword',
						value: '879863881349087252'
					},
					{
						label: 'Letter Tile',
						value: '879863686565621790'
					}
				]),
		);
		message.channel.send({ 
			embeds: [
				{
					author: {
						name: "Discord Together",
						iconURL: message.guild.iconURL()
					},
					description: `Choose an activity below!`,
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
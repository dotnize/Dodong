const Command = require("../structures/command.js");
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = new Command({
	name: "together",
	aliases: ['t', 'party', 'partygames'],
	description: "Discord Together!",
	permission: "SEND_MESSAGES",
	async run(message, args, client, slash) {
        if(!message.member.voice.channel)
			return message.reply({ embeds: [{ description: `You must be in a voice channel.`, color: 0xb84e44 }], ephemeral: true });

		const row = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('together')
				.setPlaceholder('Choose an activity')
				.setMinValues(1)
				.setMaxValues(1)
				.addOptions([
					{
						label: 'Watch Together',
						value: '880218394199220334'
					},
					{
						label: 'Poker Night',
						value: '755827207812677713'
					},
					{
						label: 'Betrayal.io',
						value: '773336526917861400'
					},
					{
						label: 'Fishington.io',
						value: '814288819477020702'
					},
					{
						label: 'Chess In The Park',
						value: '832012774040141894'
					},
					{
						label: 'Doodle Crew',
						value: '878067389634314250'
					},
					{
						label: 'Sketch Heads',
						value: '902271654783242291'
					},
					{
						label: 'Letter League',
						value: '879863686565621790'
					},
					{
						label: 'Word Snacks',
						value: '879863976006127627'
					},
					{
						label: 'SpellCast',
						value: '852509694341283871'
					},
					{
						label: 'Checkers In The Park',
						value: '832013003968348200'
					},
					{
						label: 'Blazing 8s',
						value: '832025144389533716'
					},
					{
						label: 'Land-io',
						value: '903769130790969345'
					},
					{
						label: 'Putt Party',
						value: '945737671223947305'
					}
				]),
		);
		message.reply({ 
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

const Event = require("../structures/event.js");

module.exports = new Event("messageCreate", (client, message) => {
	if (message.author.bot) return;

	if (!message.content.startsWith(client.prefix)) return;

	if(!message.guild.me.permissionsIn(message.channel).has(client.requiredTextPermissions)) return;

	const args = message.content.substring(client.prefix.length).split(/ +/);

	const command = client.commands.find(cmd => cmd.name == args[0] || cmd.aliases.includes(args[0]));

	if (!command) return;

	if(!message.member.permissionsIn(message.channel).has(command.permission))
		return message.reply(`You do not have the permission \`${command.permission}\` to run this command!`);

	command.run(message, args, client);
});
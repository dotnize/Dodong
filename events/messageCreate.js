const config = require("../config.js");
const Event = require("../structures/event.js");

module.exports = new Event("messageCreate", (client, message) => {
	if (message.author.bot) return;

	if (!message.content.startsWith(client.prefix)) return;

	if(!message.guild.members.me.permissionsIn(message.channel).has(client.requiredTextPermissions)) return;

	const args = message.content.substring(client.prefix.length).split(/ +/);

	const command = client.commands.find(cmd => cmd.name == args[0] || cmd.aliases.includes(args[0]));

	if (!command) return;

	if(!message.member.permissionsIn(message.channel).has(command.permission))
		return message.reply(`You do not have the permission \`${command.permission}\` to run this command!`);

	args.splice(0, 1);
	command.run(message, args, client, false).then( () => {
		// Webplayer Auto-Update
		if( !client.hasWebplayer ) return;

		["disconnect", "loop", "clear", "pause", "play", "remove", "resume", "seek"].forEach( (cn) => {
			if(cn == command.name){
				client.io.to(message.guild.id).emit("forceUpdate", {from: "messageCreate-"+command.name});
			}
		})
	});
});
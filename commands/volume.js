const Command = require("../structures/command.js");
const { MessageEmbed } = require('discord.js');
const maxVolume = 100;

module.exports = new Command({
    name: "volume",
    aliases: ["vol"],
    description: "Adjusts the bot volume",
    permission: "SEND_MESSAGES",

    async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) {
            const embed = new MessageEmbed();
            embed.setColor('#b84e44');
            embed.setDescription(`There's nothing currently playing in the server.`);
            return message.reply({ embeds: [embed] });
        }

        // returns the current volume, instructions for adjusting the volume if theres no args
        const vol = parseInt(args[1]);
        if (!vol) {
            const embed = new MessageEmbed();
            embed.setColor('#44b868');
            embed.setDescription(`The volume is set on 🔊 ${queue.volume} \n*↳ Please enter between **1** and **${maxVolume}** to change the volume.*`);
            return message.reply({ embeds: [embed] });
        }

        // checks if the volume has already set on the requested value
        if (queue.volume === vol) {
            const embed = new MessageEmbed();
            embed.setColor('#b84e44');
            embed.setDescription(`The volume you want to change is the same as the current one. \n*↳ Please try again with a different number.*`);
            return message.reply({ embeds: [embed] });
        }

        // checks the requested value is valid
        if (vol < 0 || vol > maxVolume) {
            const embed = new MessageEmbed();
            embed.setColor('#b84e44');
            embed.setDescription(`The specified number is not valid. \n*↳ Please enter between **1** and **${maxVolume}** to change the volume.*`);
            return message.reply({ embeds: [embed] });
        }

        const success = queue.setVolume(vol);
        return message.react(success ? `✅` : `❌`)
    },
});

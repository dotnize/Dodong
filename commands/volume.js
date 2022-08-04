const Command = require("../structures/command.js");
const { EmbedBuilder } = require('discord.js');
const maxVolume = 100;

module.exports = new Command({
    name: "volume",
    aliases: ["vol"],
    description: "Adjusts the bot volume",
    permission: "SEND_MESSAGES",
    options: [
        { description: 'Volume level from 1 to 100', name: 'level', type: 4 }
    ],
    async run(message, args, client, slash) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) {
            const embed = new EmbedBuilder();
            embed.setColor('#b84e44');
            embed.setDescription(`There's nothing currently playing in the server.`);
            return message.reply({ embeds: [embed], ephemeral: true });
        }

        // returns the current volume, instructions for adjusting the volume if theres no args
        const vol = parseInt(args);
        if (!vol) {
            const embed = new EmbedBuilder();
            embed.setColor('#44b868');
            embed.setDescription(`The volume is set on 🔊 ${queue.volume} \n*↳ Please enter between **1** and **${maxVolume}** to change the volume.*`);
            return message.reply({ embeds: [embed], ephemeral: true });
        }

        // checks if the volume has already set on the requested value
        if (queue.volume === vol) {
            const embed = new EmbedBuilder();
            embed.setColor('#b84e44');
            embed.setDescription(`The volume you want to change is the same as the current one. \n*↳ Please try again with a different number.*`);
            return message.reply({ embeds: [embed] });
        }

        // checks the requested value is valid
        if (vol < 0 || vol > maxVolume) {
            const embed = new EmbedBuilder();
            embed.setColor('#b84e44');
            embed.setDescription(`The specified number is not valid. \n*↳ Please enter between **1** and **${maxVolume}** to change the volume.*`);
            return message.reply({ embeds: [embed] });
        }

        const success = queue.setVolume(vol);
        if(success)
            slash ? message.reply({embeds: [{ description: `✅ Volume set to ${vol}`, color: 0x44b868 }]}) : message.react(`✅`);
    },
});

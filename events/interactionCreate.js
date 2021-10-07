const Event = require("../structures/event.js");
const Queue = require("../commands/queue.js");
const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js');

module.exports = new Event("interactionCreate", async (client, interaction) => {

    // interaction works like "message" here except that it has some restrictions like it can't be reacted to
    // so if ever you want to customize the send calls or even turn them to reply you can safely do it
    // you can also get who pressed the button just like who send the message in messageCreate

    // apparently interactionCreate is also called when messaging so this is to verify if the interaction is a button press
    if(interaction.componentType === "BUTTON") {   
        const queue = client.player.getQueue(interaction.guild);
        if(!queue || !queue.playing) return;
        const _isPaused = queue.connection.paused;
        const embed = new MessageEmbed();
        switch(interaction.customId){
            case "play":
                let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('play')
                        .setLabel(_isPaused ? 'Pause' : 'Play')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('skip')
                        .setLabel('Skip')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('disconnect')
                        .setLabel('Disconnect')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('queue')
                        .setLabel('Show queue')
                        .setStyle('SECONDARY')
                )
                let status = "";
                if(!_isPaused){
                    queue.setPaused(true);
                    status = "paused";
                }else{
                    queue.setPaused(false);
                    status = "resumed";
                }
                queue.npmessage.edit({
                    embeds: [
                        {
                            title: `Now playing`,
                            description: `**[${queue.current.title}](${queue.current.url})**\n${status} by ${interaction.user}`,
                            footer: {
                                text: `queued by ${queue.current.requestedBy.tag}`
                            },
                            thumbnail: {
                                url: `${queue.current.thumbnail}`
                            },
                            color: 0xffffff,
                        }
                    ],
                    components: [row]
                });
                await interaction.deferUpdate();
                break;
            case "disconnect":
                embed.setDescription(`👋 Disconnected.`);
                embed.setFooter(interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.channel.send({ embeds: [embed] });
                queue.destroy(true);
                await interaction.deferUpdate();
                break;
            case "skip":
                embed.setDescription(`Skipped **[${queue.current.title}](${queue.current.url})**`);
                embed.setFooter(interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.channel.send({ embeds: [embed] });
                queue.skip();
                await interaction.deferUpdate();
                break;
            case "queue":
                Queue.run(interaction, ["queue"], client, true);
                await interaction.deferUpdate();
                break;
        }
    }

});
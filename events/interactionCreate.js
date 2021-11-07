const Event = require("../structures/event.js");
const Queue = require("../commands/queue.js");
const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js');
const fetch = require('node-fetch');

module.exports = new Event("interactionCreate", async (client, interaction) => {


	if(!interaction.guild.me.permissionsIn(interaction.channel).has(client.requiredTextPermissions)) return;

    // interaction works like "message" here except that it has some restrictions like it can't be reacted to
    // so if ever you want to customize the send calls or even turn them to reply you can safely do it
    // you can also get who pressed the button just like who send the message in messageCreate

    // apparently interactionCreate is also called when messaging so this is to verify if the interaction is a button press
    if(interaction.componentType === "BUTTON" && interaction.customId.includes("buttoncontrol")) {
        const queue = client.player.getQueue(interaction.guild);
        if(!queue || !queue.playing) return;
        const _isPaused = queue.connection.paused;
        const embed = new MessageEmbed();
        switch(interaction.customId){
            case "buttoncontrol_play":
                let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('buttoncontrol_play')
                        .setLabel(_isPaused ? 'Pause' : 'Resume')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('buttoncontrol_skip')
                        .setLabel('Skip')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('buttoncontrol_disconnect')
                        .setLabel('Disconnect')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('buttoncontrol_queue')
                        .setLabel('Show queue')
                        .setStyle('SECONDARY')
                )
                let status;
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
                            description: `**[${queue.current.title}](${queue.current.url})** - ${queue.current.requestedBy}\n\n${status} by ${interaction.user}`,
                            thumbnail: {
                                url: `${queue.current.thumbnail}`
                            },
                            color: _isPaused ? 0x44b868 : 0xb84e44,
                        }
                    ],
                    components: [row]
                });
                await interaction.deferUpdate();
                break;
            case "buttoncontrol_disconnect":
                embed.setDescription(`👋 Disconnected.`);
                embed.setColor('#44b868');
                embed.setFooter(interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.channel.send({ embeds: [embed] });
                await interaction.deferUpdate();
                queue.destroy(true);
                break;
            case "buttoncontrol_skip":
                embed.setDescription(`Skipped **[${queue.current.title}](${queue.current.url})**`);
                embed.setColor('#44b868');
                embed.setFooter(interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.channel.send({ embeds: [embed] });
                await interaction.deferUpdate();
                queue.skip();
                break;
            case "buttoncontrol_queue":
                Queue.run(interaction, ["queue"], client, true);
                await interaction.deferUpdate();
                break;
        }
    }
    // Discord Together/Activities
    if (interaction.isSelectMenu() && interaction.customId === "together") {
        if(interaction.member.voice.channel) {
            try {
                await fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
                    method: 'POST',
                    body: JSON.stringify({
                        max_age: 86400,
                        max_uses: 0,
                        target_application_id: interaction.values[0],
                        target_type: 2,
                        temporary: false,
                        validate: null,
                    }),
                    headers: {
                        Authorization: `Bot ${client.token}`,
                        'Content-Type': 'application/json',
                    },
                })
                  .then((res) => res.json())
                  .then((invite) => {
                    if (invite.error || !invite.code || Number(invite.code) === 50013) {
                        return console.log(`(${interaction.guild.name}) An error occurred while starting activity id ${interaction.values[0]}`);
                    }
                    interaction.channel.send(`${interaction.member} https://discord.com/invite/${invite.code}`);
                    interaction.deferUpdate();
                });
            } catch (err) {
                console.log(`(${interaction.guild.name}) An error occurred while starting activity id ${interaction.values[0]}`);
            }
        }
    }
});
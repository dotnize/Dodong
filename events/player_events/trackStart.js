const Event = require("../../structures/event.js");
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = new Event("trackStart", async (player, queue, track) => {
    if(!queue.guild.me.permissionsIn(queue.metadata.channel).has(player.client.requiredTextPermissions)) {
        console.log(`(${queue.guild.name}) destroying queue due to missing text channel permissions`);
        return queue.destroy();
    }
    if(queue.npmessage && queue.npmessage.editable) {
        queue.npmessage.delete().catch(error=> {});
    }
    let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('buttoncontrol_play')
                .setLabel('Pause')
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
    const title = ['spotify-custom', 'soundcloud-custom'].includes(track.source) ?
        `${track.author} - ${track.title}` : `${track.title}`;
    queue.metadata.channel.send({
        embeds: [
            {
                title: `Now playing`,
                description: `**[${title}](${track.url})** - ${track.requestedBy}`,
                thumbnail: {
                    url: `${track.thumbnail}`
                },
                color: 0x44b868,
            }
        ],
        components: [row]
    }).then((msg) => {
        queue.npmessage = msg;
    }).then( () => { // Webplayer Auto-Update
        if( player.client.hasWebplayer )
        player.client.io.to(queue.guild.id).emit("forceUpdate", {from: "music-trackStart"});
    });
});
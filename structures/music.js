const {MessageActionRow, MessageButton} = require('discord.js');

module.exports.musicEvents = (player) => {

    player.on("error", (queue, error) => {
        console.log(`(${queue.guild.name}) error: ${error.message}`);
    });
    player.on("connectionError", (queue, error) => {
        console.log(`(${queue.guild.name}) connectionError: ${error.message}`);
    });
    player.on("trackEnd", (queue, track) => {
        if(queue.npmessage) {
            queue.npmessage.delete().catch(error=> {});
        }
    });
    player.on("trackStart", (queue, track) => {
        if(!queue.guild.me.permissionsIn(queue.metadata.channel).has(player.client.requiredTextPermissions)) {
            console.log(`(${queue.guild.name}) destroying queue due to missing text channel permissions`);
            return queue.destroy();
        }
        // I don't know if there's a proper way to check first if a message exists.
        // If you do, feel free to open a PR/issue!
        if(queue.npmessage) {
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

        queue.metadata.channel.send({
            embeds: [
                {
                    title: `Now playing`,
                    description: `**[${track.title}](${track.url})** - ${track.requestedBy}`,
                    thumbnail: {
                        url: `${track.thumbnail}`
                    },
                    color: 0x44b868,
                }
            ],
            components: [row]
        }).then((msg) => {
			queue.npmessage = msg;
        });
    });

    player.on("trackAdd", (queue, track) => {
        queue.metadata.channel.send({
            embeds: [
                {
                    description: `Queued **[${track.title}](${track.url})**`,
                    color: 0x44b868
                }
            ]
        });
    });

    player.on("tracksAdd", (queue, tracks) => {
        queue.metadata.channel.send({
            embeds: [
                {
                    description: `Queued **${tracks.length}** tracks from [${tracks[0].playlist.title}](${tracks[0].playlist.url})`,
                    color: 0x44b868
                }
            ]
        });
    });

};
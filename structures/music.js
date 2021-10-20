const {MessageActionRow, MessageButton} = require('discord.js');

module.exports.musicEvents = (player) => {

    player.on("error", (queue, error) => {
        console.log(`(${queue.guild.name}) error: ${error.message}`);
    });
    player.on("connectionError", (queue, error) => {
        console.log(`(${queue.guild.name}) connectionError: ${error.message}`);
    });
    player.on("trackEnd", (queue, track) => {
        try {
            if(queue.npmessage) queue.npmessage.delete();
        } catch {
            console.log(`(${queue.guild.name}) error while attempting to delete npmessage.`);
        }
    });
    player.on("trackStart", (queue, track) => {
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
                    description: `**[${track.title}](${track.url})**`,
                    footer: {
                        text: `queued by ${track.requestedBy.tag}`
                    },
                    thumbnail: {
                        url: `${track.thumbnail}`
                    },
                    color: 0xffffff,
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
                    color: 0xffffff
                }
            ]
        });
    });

    player.on("tracksAdd", (queue, tracks) => {
        queue.metadata.channel.send({
            embeds: [
                {
                    description: `Queued **${tracks.length}** tracks from [${tracks[0].playlist.title}](${tracks[0].playlist.url})`,
                    color: 0xffffff
                }
            ]
        });
    });

};
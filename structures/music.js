const {MessageActionRow, MessageButton} = require('discord.js');

module.exports.musicEvents = (player) => {

    player.on("error", (queue, error) => {
        console.log(`(${queue.guild.name}) error: ${error.message}`);
    });
    player.on("connectionError", (queue, error) => {
        console.log(`(${queue.guild.name}) connectionError: ${error.message}`);
    });
    player.on("trackEnd", (queue, track) => {
        if(!isObjEmpty(queue.oldnpmessage)) {
            queue.oldnpmessage.delete();
        }
    });
    player.on("trackStart", (queue, track) => {
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('play')
                    .setLabel('Play & Pause')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('skip')
                    .setLabel('Skip')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('stop')
                    .setLabel('Stop')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('queue')
                    .setLabel('Show queue')
                    .setStyle('SECONDARY')
            )

        queue.metadata.channel.send({
            embeds: [
                {
                    title: `Now playing`,
                    description: `[${track.title}](${track.url})`,
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
			queue.oldnpmessage = msg;
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
                    description: `Queued **${tracks.length}** tracks`,
                    color: 0xffffff
                }
            ]
        });
    });

};
function isObjEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
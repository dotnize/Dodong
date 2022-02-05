const Event = require("../../structures/event.js");
const { QueueRepeatMode } = require('discord-player');

module.exports = new Event("controlSignal", async (client, socket, io, args) => {
	// Arguments should be passed in a single object called arguments for "modularity"
	if(args.guild === undefined ) return;

    const queue = client.player.getQueue(args.guild);
    if(!queue) return;

    // This will be a hell long switch statement
    switch(args.type){
        case "loop":
            // Loop
            switch(args.repeatType){
                case 0:
                    queue.setRepeatMode(QueueRepeatMode.OFF);
                    break;
                case 1:
                    queue.setRepeatMode(QueueRepeatMode.TRACK);
                    break;
                case 2:
                    queue.setRepeatMode(QueueRepeatMode.QUEUE);
                    break;
                default:
                    console.error("Invalid repeatMode passed: " + args.repeatType);
                    break;
            }
            break;
        case "pause":
            if(!queue.playing) return;
            queue.setPaused(true);
            break;
        case "resume":
            queue.setPaused(false);
            break;
        case "skip":
            queue.skip();
            break;
        case "remove":
            queue.remove(args.trackIndex);
            socket.emit("forceUpdate", {from: "controlSignal-remove"});
            break;
        case "seek":
            await queue.seek(args.prog * 1000);
            break;
        case "move":
            const track = queue.remove(args.initialPos);
            queue.insert(track, args.finalPos);
            break;
        case "shuffle":
            await queue.shuffle();
            io.to(args.guild).emit("forceUpdate", {from: "controlSignal-shuffle"})
            break;
        case "volume":
            if(queue.volume === args.volume) return;
            if(args.volume < 0 && args.volume > 100) return;
            queue.setVolume(args.volume);
            break;
    }

});
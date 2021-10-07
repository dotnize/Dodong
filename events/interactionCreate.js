const Event = require("../structures/event.js");
const Pause = require("../commands/pause.js");
const Resume = require("../commands/resume.js")
const Next = require("../commands/skip.js");
const DC = require("../commands/disconnect.js");
const Queue = require("../commands/queue.js");

module.exports = new Event("interactionCreate", async (client, button) => {

    // button works like "message" here except that it has some restrictions like it can't be reacted to
    // so if ever you want to customize the send calls or even turn them to reply you can safely do it
    // you can also get who pressed the button just like who send the message in messageCreate

    // apparently interactionCreate is also called when messaging so this is to verify if the interaction is a button press
    if(button.componentType != "BUTTON") return;   

    let queue = client.player.getQueue(button.guild);
    if(!queue) return button.channel.send("Error, No queue");
    let _isPaused = queue.connection.paused;

    switch(button.customId){
        case "play":
            if(!_isPaused){
                Pause.run(button, ["pause"], client, true);
                // button.channel.send("Pausing queue");
            }else{
                Resume.run(button, ["resume"], client, true);
                // button.channel.send("Resuming queue");
            }
            break;
        case "stop":
            // button.channel.send("Disconnecting...");
            DC.run(button, ["dc"], client, true);
            break;
        case "skip":
            // button.channel.send("Skipping...");
            Next.run(button, ["skip"], client, true);
            break;
        case "queue":
            Queue.run(button, ["queue"], client, true);
            break;
    }

    // Supposed to be a way to prevent the "interaction failed" but it doesn't work here because basically, we are not using the interaction but a message
    // await button.reply.defer();
    return;
});
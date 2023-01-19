const Event = require("../../structures/event.js");

module.exports = new Event("trackEnd", async (player, queue, track) => {
    if(queue.npmessage && queue.npmessage.editable) {
        queue.npmessage.delete().catch(error=> {});
    }
});
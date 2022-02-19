const Event = require("../../structures/event.js");

module.exports = new Event("queueEnd", async (player, queue) => {
    if(queue.npmessage && queue.npmessage.editable) {
        queue.npmessage.delete().catch(error=> {});
    }
});
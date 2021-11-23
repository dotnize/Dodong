const { io } = require("socket.io-client");

class Web {
	constructor(webserver) {
        this.socket = io(webserver);
        console.log("Web Player: Socket.io client started");
        
        this.socket.on("connect", () => {
            console.log(`Web Player: Connected to ${webserver} as ${this.socket.id}`);
        });
        this.socket.on("disconnect", () => {
            console.log(`Web Player: Disconnected from the server.`);
        });
	}
}

module.exports = Web;
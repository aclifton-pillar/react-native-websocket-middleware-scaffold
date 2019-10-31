const WebSocket = require('ws');
const moment = require('moment');

class SocketServer {
    constructor(server) {
        this._timeClients = [];
        this._wss = new WebSocket.Server({noServer: true});
        this._wss.on('connection', (ws, request) => {
            this.registerClient(ws);
        });
        if (server) {
            this.register(server);
        }
    }

    register(server) {
        server.on('upgrade', (request, socket, head) => {
            this._wss.handleUpgrade(request, socket, head, (ws) => {
                this._wss.emit('connection', ws, request);
            });
        });
        setInterval(this.sendTime.bind(this), 1000);
    }

    disconnect(sender) {
        return () => {
            this._timeClients = this._timeClients.filter(client => client !== sender);
        }
    }

    sendTime() {
        this._timeClients.forEach(client => client.send(
            JSON.stringify({time: moment().toString()})));
    }

    sendMessage(message) {
        this._timeClients.forEach(
            client => client.send(JSON.stringify({message: message})));
    }

    registerClient(ws, name) {
        console.log('connected client');
        ws.on('close', this.disconnect(ws));
        ws.on('message', console.dir);
        this._timeClients.push(ws);
    }
}

module.exports = SocketServer;

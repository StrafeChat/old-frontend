export default class Client extends WebSocket {

    public sendHeartbeat() {
        super.send(JSON.stringify({ op: 1, d: null }));
    }

}

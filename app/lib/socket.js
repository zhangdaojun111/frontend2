import Mediator from './mediator';
import {PMAPI, PMENUM} from './postmsg'
let SocketMgr = {

    socket: null,

    connect: function () {
        this.socket = new WebSocket(window.config.sysConfig.websocket_addr);
        this.socket.onopen = function (e) {
            this.send(JSON.stringify({
                'user_id': window.config.sysConfig.userInfo.ID,
                'session_id': window.config.sysConfig.userInfo.sessionid
            }));
        };
        this.socket.onmessage = function (event) {
            let data = JSON.parse(event.data);
            let info = data.info || {};
            info.typeName = data.type;
            Mediator.emit('socket:' + data.type, info);
            PMAPI.sendToAllChildren({
                type: PMENUM[info.typeName],
                data: info
            });
        };
        this.socket.onclose = function (event) {
            SocketMgr.connect();
        };
        this.socket.onerror = function (event) {
            // console.log(event);
        };
    },

    disConnect: function () {
        this.socket.close();
    }

}

export {SocketMgr};
// SocketMgr.connect();
// window.setTimeout(function () {
//     SocketMgr.socket.send(JSON.stringify({
//         "test": 1,
//         'msg_type': 5
//     }))
// }, 2000)


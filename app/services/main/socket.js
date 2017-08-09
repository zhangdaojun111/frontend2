// import Mediator from '../../lib/mediator';
//
// let SocketMgr = {
//
//     socket: null,
//
//     connect: function () {
//         this.socket = new WebSocket(window.config.sysConfig.websocket_addr);
//         this.socket.onopen = function (e) {
//             this.send(JSON.stringify({
//                 'user_id': window.config.sysConfig.userInfo.ID,
//                 'session_id': window.config.sysConfig.userInfo.sessionid
//             }));
//         };
//         this.socket.onmessage = function (event) {
//             let data = JSON.parse(event.data);
//             Mediator.emit('socket:' + data.type, data.info);
//         };
//         this.socket.onclose = function (event) {
//             SocketMgr.connect();
//         };
//         this.socket.onerror = function (event) {
//             console.log('socket error:' + event);
//         };
//     },
//
//     disConnect: function () {
//         this.socket.close();
//     }
//
// }
//
// SocketMgr.connect();
//
// window.setTimeout(function () {
//     SocketMgr.socket.send(JSON.stringify({
//         "test": 1,
//         'msg_type': 1
//     }))
// }, 2000)
//
//

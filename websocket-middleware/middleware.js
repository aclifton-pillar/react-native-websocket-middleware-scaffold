import {
    WS_CONNECT,
    WS_CONNECTED,
    WS_CONNECTING,
    WS_DISCONNECT,
    WS_DISCONNECTED,
    WS_MESSAGE,
    WS_SEND,
    wsConnected,
    wsDisconnected
} from "./actions";

const webSocketMiddle = () => {
    let socket = null;

    const onOpen = store => event => {
        store.dispatch(wsConnected(event.target.url));
    };

    const onClose = store => event => {
        store.dispatch(wsDisconnected(event.target.url));
    };

    const onMessage = store => event => {
        const payload = JSON.parse(event.data);
        store.dispatch({
            type: WS_MESSAGE,
            payload: payload
        });
    };

    const closeExisting = () => {
        if (socket !== null) {
            socket.close();
        }
    };

    return store => next => action => {
        const connect = (action) => {
            closeExisting();
            socket = new WebSocket('ws://10.0.2.2:3000');
            socket.onmessage = onMessage(store);
            socket.onclose = onClose(store);
            socket.onopen = onOpen(store)
        };

        const disconnect = () => {
            closeExisting();
            socket = null;
        };

        const send = action => {
            socket && socket.send(JSON.stringify({
                command: WS_SEND,
                message: action.msg
            }));
        };

        const actionHandlers = {
            [WS_CONNECT]: connect,
            [WS_DISCONNECT]: disconnect,
            [WS_SEND]: send
        };

        const handler = actionHandlers[action.type];

        if (handler) handler(action);

        return next(action);
    }
};

export default webSocketMiddle();
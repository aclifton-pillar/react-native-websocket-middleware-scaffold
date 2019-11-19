# React Native Websocket Using Our Own Implementation of Redux Websocket

This is a simplistic implementation of a redux websocket
middleware that we implemented ourselves.
Using it, the app can connect to a simple backend server, 
and receive and display messages from it.

## Installation

In the project root, `npm install`.

In the project server directory, `npm install`.

## Running

To run and use the application, you'll first start
the backend server:  `node server/index.js`

Then, run Metro Bundler and the application:
`npm run ios` or `npm run android`

Click the `Start` button and the app will connect
via websocket and begin receiving the updated
time from the backend.

If you enter a string message into the field above
the `Send` button and then click the button, you can
examine the console output from the backend server
and see the message received by the backend.

## Discussion

Using Redux middleware to manage websocket connections
is easy to maintain, fits well into managing state
in a React app, and is fast to implement.

We used [This Tutorial](https://dev.to/aduranil/how-to-use-websockets-with-redux-a-step-by-step-guide-to-writing-understanding-connecting-socket-middleware-to-your-project-km3)
as a basis for our implementation, improving it
somewhat by using better Redux patterns.

In our example, a few pieces are required to make it
work:

The middleware is applied in `src/store/store.js`.
Also, the reducer used to accept messages and
store them in state, in this case the time, is
combined and provided to the store.

```
import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import webSocketMiddle from "../../websocket-middleware/middleware";
import timeReducer from "../components/time/time-reducers";

function prepareStore(state) {
    return createStore(combineReducers({time: timeReducer}), state, applyMiddleware(thunk, webSocketMiddle));
}

export default prepareStore;
```

An action creator is added, that is fired when the
`Auto` button is pressed, resulting in a connection
to the websocket server.

```
import {Platform} from 'react-native';
import {WS_SEND, wsConnect} from "../../../websocket-middleware/actions";

export const getTime = () => {
    return dispatch => {
        return null;
    };
};

export const startTime = () => {
    return dispatch => {
        dispatch(wsConnect(Platform.OS === 'ios' ? "ws://localhost:3000": "ws://10.0.2.2:3000"));
        return null;
    }
};

export const sendText = text => {
    return dispatch => {
        dispatch({type: WS_SEND, msg: text});
        return null;
    }
};
```

And a reducer is added that takes inbound websocket
messages and stores them in state, so that the
updated time can be displayed in the view.

```
const updateTime = (state, action) => {
    return action.payload.time;
};

const unknown = (state, action) => {
    return action.type;
};

const timeReducer = (state = null, action) => {
    const reducers = {
        "WS_MESSAGE": updateTime
    };

    const reducer = reducers[action.type];

    return reducer ? reducer(state, action): unknown(state, action);
};

export default timeReducer;
```

The actual middleware resides in two files,
`websocket-middleware/actions.js` and 
`websocket-middleware/middleware.js`.

The first defines actions involved in connecting
to the websocket server, sending, and receiving
messages.

```
export const WS_CONNECT = 'WS_CONNECT';
export const WS_CONNECTING = 'WS_CONNECTING';
export const WS_CONNECTED = 'WS_CONNECTED';
export const WS_DISCONNECT = 'WS_DISCONNECT';
export const WS_DISCONNECTED = 'WS_DISCONNECTED';

export const WS_MESSAGE = 'WS_MESSAGE';
export const WS_SEND = 'WS_SEND';

export const wsConnect = host => ({ type: WS_CONNECT, host });
export const wsConnecting = host => ({ type: WS_CONNECTING, host });
export const wsConnected = host => ({ type: WS_CONNECTED, host });
export const wsDisconnect = host => ({ type: WS_DISCONNECT, host });
export const wsDisconnected = host => ({ type: WS_DISCONNECTED, host });
```

And the second file contains the actual middlware.
When it is supplied to the store, listeners are set
up for the websocket connection.  A callback is
returned that processes actions before they reach
the reducers or other middleware, and then passes
the actions along.

You'll notice we followed the same pattern as we
did in the time-reducers file.  However, we always
call next(action) and return the result.  Otherwise,
the middleware would vanish any actions it processes.

```
...

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
            socket = new WebSocket(Platform.OS === 'ios' ? "ws://localhost:3000": "ws://10.0.2.2:3000");
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

...
```

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
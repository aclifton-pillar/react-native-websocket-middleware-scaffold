import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from "redux-thunk";
import webSocketMiddle from "../../websocket-middleware/middleware";
import timeReducer from "../components/time/time-reducers";

function prepareStore(state) {
    return createStore(combineReducers({time: timeReducer}), state, applyMiddleware(thunk, webSocketMiddle));
}

export default prepareStore;
import timeReducer from "./time-reducers";
import {WS_MESSAGE} from "../../../websocket-middleware/actions";
import Chance from 'chance';

const chance = new Chance();

describe("Time Reducer", () => {
    test("should update state with time when WS_MESSAGE received", () => {
        const initialState = null;
        const action = {
            type: WS_MESSAGE,
            payload: {
                time: chance.string()
            }
        };

        const updatedState = timeReducer(initialState, action);

        expect(updatedState).toEqual(action.payload.time);
    });
});
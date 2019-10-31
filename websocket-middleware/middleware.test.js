import webSocketMiddle from './middleware';
import * as sinon from "sinon";
import Chance from 'chance';
import {WS_CONNECT} from "./actions";

const chance = new Chance();

describe("Websocket Middleware", () => {
    test("should exist", () => {
        const middleware = webSocketMiddle;

        expect(middleware).not.toBeNull();
    });

    test("should return next(action) when action is irrelevant to it", () => {
        const store = {};
        const next = sinon.spy();
        const action = {
            type: 'NOOPERATION'
        };

        const middlewareResponse = webSocketMiddle(store)(next)(action);

        expect(next.calledWithExactly(action)).toEqual(true);
        expect(middlewareResponse).not.toBeNull();
    });

    test("should return next(action) when action is WS_SEND", () => {
        const store = {};
        const next = sinon.spy();
        const action = {
            type: 'WS_SEND',
            msg: chance.string()
        };

        webSocketMiddle(store)(next)({type: WS_CONNECT});

        const middlewareResponse = webSocketMiddle(store)(next)(action);

        expect(middlewareResponse).not.toBeNull();
        expect(next.calledWithExactly(action)).toEqual(true);
    });

    test("should not try to send when no connection has been established", () => {
        // https://stackoverflow.com/questions/42867183/mocking-websocket-in-jest
    });
});
import webSocketMiddle from './middleware';
import * as sinon from "sinon";
import WS from "jest-websocket-mock";
import Chance from 'chance';
import {WS_CONNECT} from "./actions";

const server = new WS("ws://10.0.2.2:3000");

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

    describe("WS_CONNECT", () => {
        test("should dispatch WS_CONNECTED when connected", async () => {
            const store = { dispatch: sinon.spy() };
            const next = sinon.stub();
            const expected = { type: 'WS_CONNECTED', host: 'ws://10.0.2.2:3000/' };

            webSocketMiddle(store)(next)({type: WS_CONNECT, host: 'ANYTHING'});
            await server.connected;

            let firstCallFirstArg = store.dispatch.args[0][0];
            expect(firstCallFirstArg).toEqual(expected);
        });
    });

    describe("WS_SEND", () => {
        test("should return next(action) when action is WS_SEND", async () => {
            const store = { dispatch: sinon.stub() };
            const next = sinon.spy();
            const action = {
                type: 'WS_SEND',
                msg: chance.string()
            };

            webSocketMiddle(store)(next)({type: WS_CONNECT});

            await server.connected;

            const middlewareResponse = webSocketMiddle(store)(next)(action);

            expect(middlewareResponse).not.toBeNull();
            expect(next.calledWithExactly(action)).toEqual(true);
        });

        test("should not try to send when no connection has been established", () => {
            const store = {};
            const next = sinon.spy();
            const action = {
                type: 'WS_SEND',
                msg: chance.string()
            };

            // Do not connect
            // webSocketMiddle(store)(next)({type: WS_CONNECT});
            // await server.connected;

            const middlewareResponse = webSocketMiddle(store)(next)(action);

            expect(middlewareResponse).not.toBeNull();
            expect(server).not.toHaveReceivedMessages([action]);
        });
    });
});
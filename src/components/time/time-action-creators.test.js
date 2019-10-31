import * as sinon from "sinon";
import Chance from 'chance';
import {WS_SEND} from "../../../websocket-middleware/actions";
import {sendText} from "./time-action-creators";

const chance = new Chance();

describe("Web Socket Messages", () => {
    let dispatchSpy;

    beforeEach(() => {
        dispatchSpy = sinon.spy();
    });

    describe("sendText", () => {
        test("should dispatch WS_SEND with text", () => {
            const expectedText = chance.string();

            const expectedEvent = {
                type: WS_SEND,
                msg: expectedText
            };

            sendText(expectedText)(dispatchSpy);

            expect(dispatchSpy.calledWithExactly(expectedEvent)).toEqual(true);
        });
    });
});
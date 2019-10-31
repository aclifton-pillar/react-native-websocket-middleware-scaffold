import React from 'react';
import {shallow} from 'enzyme';
import * as sinon from "sinon";
import Time from "./time";

describe("Time", () => {
    let time;

    const sendAC = sinon.spy();

    const properties = {
        sendText: sendAC,
    };

    beforeEach(() => {
        time = shallow(<Time {...properties} />);
    });

    describe("send button", () => {
        test("should call send text action creator when button is clicked", async () => {
            const sendButton = time.find(".send-button");

            await sendButton.simulate("press");

            expect(sendAC.called).toEqual(true);
        });
    });
});
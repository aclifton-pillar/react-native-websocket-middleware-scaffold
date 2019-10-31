import React from 'react';
import {shallow} from 'enzyme';
import * as sinon from "sinon";
import Time from "./time";
import Chance from 'chance';

const chance = new Chance();

describe("Time", () => {
    let time;

    const sendAC = sinon.spy();

    const properties = {
        time: chance.string(),
        sendText: sendAC,
    };

    beforeEach(() => {
        time = shallow(<Time {...properties} />);
    });

    describe("time", () => {
        test("should display time", () => {
            const timeDisplay = time.find('.time');

            expect(timeDisplay.childAt(0).text()).toContain(properties.time);
        });
    });

    describe("send button", () => {
        test("should call send text action creator when button is clicked", async () => {
            const sendButton = time.find(".send-button");

            await sendButton.simulate("press");

            expect(sendAC.called).toEqual(true);
        });
    });
});
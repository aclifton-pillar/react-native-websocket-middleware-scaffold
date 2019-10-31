import React from 'react';
import prepareStore from "../../store/store";
import {Provider} from "react-redux";
import TimeConnector from './main-connector';

const store = prepareStore();

const MainProvider = () => (
    <Provider store={store}>
        <TimeConnector/>
    </Provider>
);

export default MainProvider;

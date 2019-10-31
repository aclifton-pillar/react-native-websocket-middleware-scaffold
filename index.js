import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import MainProvider from "./src/views/main/main-provider";

AppRegistry.registerComponent(appName, () => MainProvider);


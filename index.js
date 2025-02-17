/**
 * @format
 */

import 'react-native-url-polyfill/auto';

import { AppRegistry, Platform } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App)

if (Platform.OS === 'web') {
    const rootTag = document.getElementById('root') || document.getElementById('main');
    AppRegistry.runApplication('main', { rootTag });
}
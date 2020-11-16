/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import * as Sentry from '@sentry/react-native';

Sentry.init({
    dsn: 'https://47f6b4cc6f7640a89e563de765f96d3f@o220842.ingest.sentry.io/5293271',
});

Sentry.addBreadcrumb({
    category: 'Navigation',
    message: 'App Loaded',
});

AppRegistry.registerComponent(appName, () => App);

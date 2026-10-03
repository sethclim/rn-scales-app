import { consoleTransport, logger } from 'react-native-logs';

// Logs only in dev builds. To ship errors somewhere in production (e.g. Sentry),
// enable it for 'error' severity and add a transport here.
export const log = logger.createLogger({
  severity: 'debug',
  transport: consoleTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
  enabled: __DEV__,
});

export const dbLog = log.extend('DB');

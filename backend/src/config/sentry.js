import * as Sentry from '@sentry/node';
import logger from '../utils/logger.js';

export const initSentry = () => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
    logger.info('Sentry initialized');
  } else {
    logger.info('SENTRY_DSN not provided, Sentry is disabled');
  }
};

export { Sentry };

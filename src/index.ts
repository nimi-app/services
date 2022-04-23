import dayjsUtcPlugin from 'dayjs/plugin/utc';
import * as Sentry from '@sentry/node';
import Mongoose from 'mongoose';
import dayjs from 'dayjs';

import { SENTRY_DSN, MONGO_URI } from './modules/config/config.service';
import { start as startServer } from './server';

// Extend dayjs
dayjs.extend(dayjsUtcPlugin);

async function startService() {
  // initilize Sentry
  Sentry.init({
    attachStacktrace: true,
    environment: process.env.NODE_ENV,
    dsn: SENTRY_DSN,
  });

  // Mongoose watchdog
  Mongoose.connection.on('error', error => {
    Sentry.captureException(error);
    process.exit(100);
  });

  console.log(MONGO_URI);

  // Mongo connect
  await Mongoose.connect(MONGO_URI as string, {});

  if (process.env.NODE_ENV !== 'test') {
    Mongoose.set('debug', true);
  }

  // Start the server
  const server = await startServer();

  console.log(`server started on ${server.info.uri}`);
}

startService().catch(error => {
  console.error(error);
  Sentry.captureException(error);
  process.exit(1);
});


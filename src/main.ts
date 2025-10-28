import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: "https://49d453c802ecb150a4fdf4883b842e38@o4510268903915520.ingest.us.sentry.io/4510268936552448",
  sendClientReports: true,
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

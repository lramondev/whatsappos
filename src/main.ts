import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/config';
import { Root } from './app/components';

bootstrapApplication(Root, appConfig)
  .catch((err) => console.error(err));

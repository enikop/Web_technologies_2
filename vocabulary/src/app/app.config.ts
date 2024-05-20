import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { accessTokenInterceptor } from './services/access-token.interceptor';
import { unauthorizedInterceptor } from './services/unauthorized.interceptor';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([accessTokenInterceptor, unauthorizedInterceptor])),
    provideAnimations(),
    provideToastr()
  ]
};

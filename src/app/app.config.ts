import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes,withComponentInputBinding()), 
    provideClientHydration(),
    provideHttpClient(),
    // importProvidersFrom(LeafletModule)
  ],
};
export const environment = {
  apiUrl:'https://api.bmkg.go.id/publik/prakiraan-cuaca',
  placesUrl:"https://wilayah.id/api",
}

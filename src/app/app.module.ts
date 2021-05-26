import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { APP_CONFIG } from './app.config';


export function appConfigFac() {
  function prepareUrl() {
    // http://localhost:3001
    const port = '3001';
    const l = window.location;
    return `${l.protocol}//${l.hostname}:${port}`;
  };
  return {
    backendUrl: environment['backendUrl'] ? environment['backendUrl'] : prepareUrl()
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [{
    provide: APP_CONFIG,
    useFactory: appConfigFac
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './services/http-interceptor/http-interceptor.service';
import { HomeResolver } from './routing/resolvers/home.resolver';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from './services/auth/auth.service';
import { SidebarModule } from './modules/layout/sidebar/sidebar.module';
import { HeaderModule } from './modules/layout/header/header.module';
import { ToolbarModule } from './modules/layout/toolbar/toolbar.module';
import { LoginModule } from './modules/pages/login/login.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NewsletterService } from './services/newsletter/newsletter.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { LoaderModule } from './utils/loader/loader.module';
import { MailModalModule } from './modules/components/modals/mail-modal/mail-modal.module';
import { SocketProviderConnect } from './services/web-socket.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    SidebarModule,
    HeaderModule,
    ToolbarModule,
    LoginModule,
    LoaderModule,
    MailModalModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerImmediately'
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      // registrationStrategy: 'registerWhenStable:30000'
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  })
  ],
  providers: [
    // HomeResolver,
    SocketProviderConnect,
    AuthService,
    NewsletterService,
    {provide: HTTP_INTERCEPTORS, useClass:HttpInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
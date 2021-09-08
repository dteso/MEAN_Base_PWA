import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { AuthService } from './services/auth/auth.service';
import { StorageService } from './services/storage/storage.service';
import Swal from 'sweetalert2';
import { NewsletterService } from './services/newsletter/newsletter.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { sidebarConfig } from './modules/layout/sidebar/config/sidebar.config';
import { LoaderService } from './services/loader/loader.service';
import { SocketProviderConnect } from './services/web-socket.service';
import { SocketClient } from './models/socket-client.model';


const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  background: 'black',
  showConfirmButton: true,
  showCancelButton: true,
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'login-app';
  logged: boolean;
  isCollapsed = true;
  user;
  fadeClass = 'slideInLeft';

  socketClient: SocketClient;


  config = sidebarConfig;

  constructor(
    private readonly storageService: StorageService,
    private router: Router,
    private readonly authService: AuthService,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private newsletterService: NewsletterService,
    private readonly translate: TranslateService, //Don't remove needed in view for pipe
    private readonly loader: LoaderService,
    protected socketService: SocketProviderConnect
  ) {

    /* Translate initialization */
    const currentLanguage = navigator.language.substring(0, 2);
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('es');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(currentLanguage);

    /* PWA check for updates and notifications subscription */
    if (environment.production) {
      this.checkVersionUpdates();
      this.subscribeToNotifications();
    }

    /* Check storage and user recovery*/
    if (!this.storageService.getItem('USER')) {
      this.router.navigate(['/login']);
    } else this.user = this.storageService.getItem('USER').user;
  }

  ngOnInit() {
    // Loading
    this.loader._loading$.next(false);
    // Check authentication
    this.authService.isAuthenticated$.subscribe(isLogged => this.logged = isLogged);

    /*socket connection as client*/
    this.socketClient = this.initSocketClientData();
    this.socketService.onConnect(this.socketClient);
    this.socketService.clientId.subscribe( id => {
      this.socketClient.clientId = id;
      console.log("Asigned uuid", this.socketClient.clientId);
    });
    
    this.isCollapsed = true;
  }



  private async checkVersionUpdates() {
    if (this.swUpdate.isEnabled) {
      await this.swUpdate.checkForUpdate().then(data => {
        console.log('Checking for Updates Now...' + data);
      });
      this.swUpdate.available.subscribe(event => {
        if (event.available.appData) {
          const appData: any = event.available.appData;
          let msg = `New version ${appData.version} available. Features added:`;
          msg += `${appData.changelog}.`;
          msg += ` Reload?`;
          this.showToast(`Great incoming changes!!!`, msg);
        }
      });
    }
  }


  subscribeToNotifications() {
    console.info("SUBSCRIBED TO NOTIFICATIONS");
    this.swPush.requestSubscription({
      serverPublicKey: environment.publicKey
    })
      .then(sub => this.newsletterService.addPushSubscriber(sub).subscribe())
      .catch(err => console.error("Could not subscribe to notifications", err));
  }


  toggleCollapse() {
    if (!this.isCollapsed) {
      this.fadeClass = 'fadeOutLeft';
    } else if (this.isCollapsed) {
      this.fadeClass = 'fadeInLeft'
    }
    setTimeout(() => {
      this.isCollapsed = !this.isCollapsed;
    }, 200);

  }

  collapse() {
    if (!this.isCollapsed) {
      this.toggleCollapse();
    }
  }

  showToast(title: any, text: any) {
    Toast.fire({
      icon: 'success',
      title,
      text
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Updated!',
          'Your application will be updated in background. Enjoy!',
          'success'
        )
      }
    });
  }


  showPrompt(icon: any, title: any, text: any) {
    Swal.fire({
      icon,
      title,
      text,
      background: 'black',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      confirmButtonColor: 'turquoise',
      cancelButtonText: "No, later",
      cancelButtonColor: 'tomato',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Updated!',
          'Your application will be updated in background. Enjoy!',
          'success'
        )
      }
    });
  }

  initSocketClientData(): SocketClient {
    return {
      type: "CONNECTION",
      room: "GENERAL",
      user: "NOT_LOGGED_YET"
    }
  }

  logout(): void {
    this.isCollapsed = true;
    this.authService.clearAuth();
    this.router.navigate(['/']);
  }

}

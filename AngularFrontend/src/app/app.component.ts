import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { AuthService } from './services/auth/auth.service';
import { StorageService } from './services/storage/storage.service';
import Swal from 'sweetalert2';
import { NewsletterService } from './services/newsletter/newsletter.service';
import { environment } from 'src/environments/environment';
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

  constructor(
    private readonly storageService: StorageService,
    private router: Router,
    private readonly authService: AuthService,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private newsletterService: NewsletterService
  ){
    this.checkVersionUpdates();
    this.subscribeToNotifications();
    if(!this.storageService.getItem('USER')) {
      this.router.navigate(['/login']);
     }else this.user = this.storageService.getItem('USER').user;
  }

  ngOnInit(){
    this.authService.isAuthenticated$.subscribe( isLogged => this.logged = isLogged);
  }

  subscribeToNotifications() {

    console.info("SUBSCRIBED TO NOTIFICATIONS");

    this.swPush.requestSubscription({
        serverPublicKey: environment.publicKey
    })
    .then(sub => this.newsletterService.addPushSubscriber(sub).subscribe())
    .catch(err => console.error("Could not subscribe to notifications", err));
}
  

  toggleCollapse(){
    if(!this.isCollapsed){
      this.fadeClass = 'fadeOutLeft';
    }else if(this.isCollapsed){
      this.fadeClass = 'fadeInLeft'
    }
    setTimeout(()=>{
      this.isCollapsed = !this.isCollapsed;
    }, 200);
    //console.log(this.isCollapsed);
    
  }

  collapse(){
    if(!this.isCollapsed){
      this.toggleCollapse();
    }
  }

  logout(): void {
    this.authService.clearAuth();
    this.router.navigate(['/']);
    this.isCollapsed = true;
  }

  private checkVersionUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate().then(data => {
        console.log('Checking for Updates Now...');
      });
      this.swUpdate.available.subscribe(event => {
        if (event.available.appData) {
          const appData: any = event.available.appData;
          let msg = `New version ${appData.version} available. Features added:`;
          msg += `${appData.changelog}.`;
          msg += ` Reload?`;
          // if (confirm(msg)) {
          //   window.location.reload();
          // }
          this.showPrompt('warning', `Great incoming changes!!!`, msg);
        }
      });
    }
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

}

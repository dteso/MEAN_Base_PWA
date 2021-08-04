import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() config: (translate, auth)=>{};
  @Output() logout: EventEmitter<any> = new EventEmitter();
  @Output() onNavigate: EventEmitter<any> = new EventEmitter();

  user;
  links;

  constructor(
    private readonly router: Router,
    private readonly sessionStorage: StorageService,
    private readonly translateService: TranslateService,
    private readonly authService: AuthService
  ) { 
    this.user= this.sessionStorage.getItem('USER').user;
  }

  ngOnChanges(){
    this.links = this.config(this.translateService, this.authService);
  }

  ngOnInit(): void {
  }

  logoutSubmitted(){
    this.onNavigate.emit(true);
    this.logout.emit(true);
  }

  navigateToSkills(){
    this.router.navigate(['skills']);
    this.onNavigate.emit(true);
  }


  navigateTo(route){
    this.router.navigate([route]);
    this.onNavigate.emit(true);
  }
}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Output() logout: EventEmitter<any> = new EventEmitter();
  @Output() onNavigate: EventEmitter<any> = new EventEmitter();

  user;

  constructor(
    private readonly router: Router,
    private readonly sessionStorage: StorageService
  ) { 
    this.user= this.sessionStorage.getItem('USER').user;
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
}

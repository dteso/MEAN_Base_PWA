import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input() logged: boolean;
  @Output() logout: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logoutSubmitted(){
    this.logout.emit(true);
  }

  navigateToHome(){
    this.router.navigate(['home']);
  }

  navigateInstagram(){
    window.location.href = 'https://www.instagram.com/sheizqui?utm_medium=copy_link';
  }

}

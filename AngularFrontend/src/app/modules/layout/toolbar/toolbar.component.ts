import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input() logged: boolean;
  @Output() logout: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private readonly storage: StorageService
  ) { }

  ngOnInit(): void {
  }

  logoutSubmitted() {
    this.logout.emit(true);
  }

  navigateToHome() {
    this.router.navigate(['home']);
  }

  navigateInstagram() {
    window.location.href = 'https://www.instagram.com/sheizqui?utm_medium=copy_link';
  }

  async downloadLog() {
    await fetch(`${environment.api_url}/log`, {
      method: 'GET',
      headers:{
        'x-token': this.storage.getItem('USER')?.token
      },
    }).then( res => {
      res.body.getReader().read().then(val => {
        saveAs( new Blob([val.value]), 'log.txt');
      });
    });
  }
}

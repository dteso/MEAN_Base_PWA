import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MailModalComponent } from '../../components/modals/mail-modal/mail-modal.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input() logged: boolean;
  @Output() logout: EventEmitter<any> = new EventEmitter();

  closeResult: string;

  constructor(
    private readonly router: Router,
    private readonly storage: StorageService,
    private readonly modalService: NgbModal
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

  openMailModal(){
    this.modalService.open(MailModalComponent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}

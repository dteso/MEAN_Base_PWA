import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-mail-modal',
  templateUrl: './mail-modal.component.html',
  styleUrls: ['./mail-modal.component.css']
})
export class MailModalComponent implements OnInit {

  mailForm: FormGroup;
  submitted=false;

  constructor(
    public modal: NgbActiveModal,
    private readonly formBuilder: FormBuilder,
    private readonly apiService: ApiService,
    private readonly translate: TranslateService
  ) { 
    this.mailForm = this.formBuilder.group({
      to: ['dtesodev@gmail.com', Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  sendMail(){
    this.submitted = true;
    if(this.mailForm.invalid) return;
    console.log(this.mailForm.value);
    this.apiService.post('dispatcher/mail', this.mailForm.value).subscribe( res => {
      this.mailForm.reset();
      this.modal.close('Mail sent!!!');
    });
  }
}

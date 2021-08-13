import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

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
    private readonly translate: TranslateService
  ) { 
    this.mailForm = this.formBuilder.group({
      to: ['d_teso@hotmail.com', Validators.required],
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
    this.mailForm.reset();
    this.modal.close('Mail sent!!!')
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailModalComponent } from './mail-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  declarations: [MailModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule
  ],
  providers: [TranslateService],
  exports: [MailModalComponent]
})
export class MailModalModule { }

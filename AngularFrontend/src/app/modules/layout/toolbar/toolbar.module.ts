import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    NgbModule
  ],
  exports: [ToolbarComponent]
})
export class ToolbarModule { }

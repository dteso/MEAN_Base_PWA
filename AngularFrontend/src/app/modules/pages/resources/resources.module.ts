import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileuploadService } from 'src/app/services/fileupload/fileupload.service';
import { ResourcesComponent } from './resources.component';
import { ResourcesRoutingModule } from './resources-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';



@NgModule({
  declarations: [ResourcesComponent],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    TranslateModule
  ],
  providers:[FileuploadService, TranslateService]
})
export class ResourcesModule { }

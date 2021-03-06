import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileuploadService } from 'src/app/services/fileupload/fileupload.service';
import { ResourcesComponent } from './resources.component';
import { ResourcesRoutingModule } from './resources-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GetFolderNamePipe } from 'src/app/utils/pipes/get-folder-name.pipe';
import { EllipsisPipe } from 'src/app/utils/pipes/ellipsis.pipe';



@NgModule({
  declarations: [ResourcesComponent, GetFolderNamePipe, EllipsisPipe],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    TranslateModule
  ],
  providers:[FileuploadService, TranslateService]
})
export class ResourcesModule { }

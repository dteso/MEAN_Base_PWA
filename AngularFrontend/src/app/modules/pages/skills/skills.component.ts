import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { FileuploadService } from 'src/app/services/fileupload/fileupload.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { environment } from 'src/environments/environment';


//TODO: Llevar a fichero de constantes
const BASE_PATH = './shared';
@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  
  imagesLoadedCounter = 0;
  imagesLoadedLength = 4;
  isLoading = true;
  dbFiles = [];
  routes = [];


  constructor(
    private readonly loaderService: LoaderService,
    private readonly fileUploadService:FileuploadService
    ) { 
      this.loaderService._loading$.next(true);
    }

  ngOnInit(): void {
    this.fileUploadService.getFilesByFolder('backup_images').subscribe(res => {
      console.log("Files", res);
      this.dbFiles = res.dbFiles;
      this.routes = res.routes.children;
      this.dbFiles.map(file => file.src = this.getTruePath(file.src));
      this.imagesLoadedLength = this.dbFiles.length;
      if (this.imagesLoadedLength === 0) this.loaderService._loading$.next(false);
      this.isLoading = false;
      console.log(this.dbFiles);
    });
   }


  setLoaded(){
    this.imagesLoadedCounter++;
    console.log("Image count: " + this.imagesLoadedCounter);
    if(this.imagesLoadedCounter === this.imagesLoadedLength){
      this.isLoading = false;
      this.loaderService._loading$.next(false);
    }
  }

// TODO: Se utiliza también en resources component
  getTruePath(path) {
    let truePath = environment.base_url;
    path = path.substring(BASE_PATH.length, path.length);
    return `${truePath}/${path.substring(1, path.length)}`
  }

}

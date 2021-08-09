import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FileuploadService } from 'src/app/services/fileupload/fileupload.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  background: 'black',
  showConfirmButton: false,
  timer: 3000,
  //timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {

  fileToUpload: File;
  imgTemp: any;
  isPdf: boolean;

  dbFiles;

  imagesLoadedCounter = 0;
  imagesLoadedLength = 0;
  isLoading = true;
  showFileInput = false;
  routes = [];

  previousFolder = './shared';
  currentPath = './shared';

  constructor(
    private readonly fileUploadService: FileuploadService,
    private readonly translateService: TranslateService,
    private readonly loaderService: LoaderService
  ) {
    this.loaderService._loading$.next(true);
  }

  ngOnInit(): void {
    this.fileUploadService.getFilesByFolder('shared').subscribe(res => {
      console.log("Files", res);
      this.dbFiles = res.dbFiles;
      this.routes = res.routes.children;

      console.log("Routes", this.routes)

      this.dbFiles.map(file => file.src = this.getTruePath(file.src));
      this.imagesLoadedLength = this.dbFiles.length;
      if (this.imagesLoadedLength === 0) this.loaderService._loading$.next(false);
      this.isLoading = false;
      console.log(this.dbFiles);
    });
  }

  loadFile(event) {
    this.fileToUpload = event.target.files[0];
    console.log(this.fileToUpload);
    if (!this.fileToUpload) { return }
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(this.fileToUpload);
    reader.onloadend = () => {
      console.log(reader.result);
      this.imgTemp = reader.result;
      if (this.fileToUpload.type === "application/pdf") this.isPdf = true;
    }
  }

  uploadFile() {
    console.log("Archivo subido!!!");
    const terminalCurrentFolder = this.currentPath.split('/')[(this.currentPath.split('/')).length - 1];
    this.fileUploadService.subirArchivo(this.fileToUpload, 'tipo1', this.currentPath).then((img) => {
      console.log("Imagen subida: " + img);
      this.imgTemp = undefined;
      this.fileToUpload = undefined;
      this.showPrompt();
      this.fileUploadService.getFilesByFolder(terminalCurrentFolder).subscribe(res => {
        this.dbFiles = res.dbFiles;
        this.dbFiles.map(file => file.src = this.getTruePath(file.src));
        this.imagesLoadedLength = this.dbFiles.length;
      });
    }
    )
  }

  deleteFile(id) {
    this.fileUploadService.deleteFile(id).subscribe(res => {
      this.showPrompt();
      this.fileUploadService.getFilesByFolder(this.currentPath).subscribe(res => {
        this.dbFiles = res.dbFiles;
        this.dbFiles.map(file => file.src = this.getTruePath(file.src));
        this.imagesLoadedLength = this.dbFiles.length;
      });
    });
  }

  showPrompt() {
    Toast.fire({
      icon: 'success',
      title: this.translateService.instant('FILE.UPLOAD.SUCESS')
    });
  }

  getTruePath(path) {
    let truePath = environment.api_url;
    return `${truePath}${path.substring(1, path.length)}`
  }

  setLoaded() {
    this.imagesLoadedCounter++;
    // console.log("Image count: " + this.imagesLoadedCounter);
    if (this.imagesLoadedCounter === this.imagesLoadedLength) {
      this.isLoading = false;
      this.loaderService._loading$.next(false);
    }
  }

  onBackFolder() {
    let previousRoot;
    let splittedCurrentFolder = this.currentPath.split('/');
    splittedCurrentFolder.pop();
    previousRoot = splittedCurrentFolder.join('/');
    this.getTreeNode(previousRoot);
  }

  getTreeNode(root) {
    console.log('Current root', root);
    this.currentPath = root;
    this.fileUploadService.getStructure(root).subscribe(res => {
      this.routes = res.paths.children;
      if (root !== '.') {
        this.fileUploadService.getFilesByFolder(root).subscribe(res => {
          this.dbFiles = res.dbFiles;
          this.dbFiles.map(file => file.src = this.getTruePath(file.src));
          this.imagesLoadedLength = this.dbFiles.length;
          if (this.imagesLoadedLength === 0)
            this.loaderService._loading$.next(false);
          this.isLoading = false;
          console.log(this.dbFiles);
        });
      }
    });
  }

  verifyIfIsFile(path) {
    return path.substring(1, path.length).indexOf('.') > 0;
  }

  onShowFileInput(){
    this.showFileInput = !this.showFileInput;
  }

}

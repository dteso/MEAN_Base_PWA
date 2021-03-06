import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api/api.service';
import { FileuploadService } from 'src/app/services/fileupload/fileupload.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const BASE_PATH = './shared';

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

  previousFolder = BASE_PATH;
  currentPath = BASE_PATH;

  stream;

  constructor(
    private readonly fileUploadService: FileuploadService,
    private readonly translateService: TranslateService,
    private readonly loaderService: LoaderService,
    private readonly storage: StorageService,
    private readonly apiService: ApiService
  ) {
    this.loaderService._loading$.next(true);
  }

  ngOnInit(): void {
    this.fileUploadService.getFilesByFolder('shared').subscribe(res => {
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

  /* Precarga un archivo */
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

  /* ejecuta la subida de un archivo al servidor */
  uploadFile() {
    Swal
    .fire({
      title: "Select catalog",
      input: "select",
      inputOptions: {
        'catalog_1': 'Catalog A',
        'catalog_2': 'Catalog B',
        'catalog_3': 'Catalog C',
        'catalog_4': 'Catalog D'
      },
      showCancelButton: true,
      confirmButtonText: "Confirm Upload",
      cancelButtonText: "Close",
    })
    .then(resultado => {
      if (resultado.value) {
        let catalog = resultado.value;
        const terminalCurrentFolder = this.currentPath.split('/')[(this.currentPath.split('/')).length - 1];
        this.fileUploadService.subirArchivo(this.fileToUpload, catalog, this.currentPath).then((img) => {
          console.log("Imagen subida: " + img);
          this.imgTemp = undefined;
          this.fileToUpload = undefined;
          this.showPrompt(this.translateService.instant('FILE.UPLOAD.SUCCESS'));
          this.fileUploadService.getFilesByFolder(terminalCurrentFolder).subscribe(res => {
            this.dbFiles = res.dbFiles;
            this.dbFiles.map(file => file.src = this.getTruePath(file.src));
            this.imagesLoadedLength = this.dbFiles.length;
            this.showFileInput=false;
          });
        });
      }
    });
  }

  /* borra un archivo */
  deleteFile(id) {
    this.fileUploadService.deleteFile(id).subscribe(res => {
      this.showPrompt(this.translateService.instant('FILE.DELETE.SUCCESS'));
      this.routes = res.routes.children;
      this.fileUploadService.getFilesByFolder(this.currentPath).subscribe(res => {
        this.dbFiles = res.dbFiles;
        this.dbFiles.map(file => file.src = this.getTruePath(file.src));
        this.imagesLoadedLength = this.dbFiles.length;
      });
    });
  }

  /* crea una carpeta */
  createFolder(path) {
    console.log(path);
    Swal
      .fire({
        title: "File Name",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Create",
        cancelButtonText: "Close",
      })
      .then(resultado => {
        if (resultado.value) {
          let nombre = resultado.value;
          this.fileUploadService.createFolder(`${path}/${nombre}`).subscribe(res => {
            this.showPrompt(this.translateService.instant('FILE.FOLDER_CREATE.SUCCESS'));
            this.routes = res.routes.children;
            // Swal.fire(`Folder ${nombre} created!!!`.trim(), '', 'success');
          });
        }
      });
  }

  /* borra una carpeta */
  deleteFolder(path) {
    this.fileUploadService.deleteFolder(`${path}`).subscribe(res => {
      this.showPrompt(this.translateService.instant('FILE.FOLDER_DELETE.SUCCESS'));
      this.routes = res.routes.children;
      this.currentPath = this.getDirFromFileRoute(path);
    });
  }


  /* permite la navegaci??n hacia atr??s */
  onBackFolder() {
    let previousRoot;
    let splittedCurrentFolder = this.currentPath.split('/');
    splittedCurrentFolder.pop();
    previousRoot = splittedCurrentFolder.join('/');
    this.getTreeNode(previousRoot);
  }


  /* obtiene la estructura de carpetas desde una ra??z pasada como argumento */
  getTreeNode(root) {
    console.log('Getting tree node by root: ', root);
    this.currentPath = root;
    this.fileUploadService.getStructure(root).subscribe(res => {
      if(res.paths)
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

/*--------------------------------------------------------------------------------------------*/


  showPrompt(title) {
    Toast.fire({
      icon: 'success',
      title
    });
  }

  getTruePath(path) {
    let truePath = environment.base_url;
    path = path.substring(BASE_PATH.length, path.length);
    return `${truePath}/${path.substring(1, path.length)}`
  }

  setLoaded() {
    this.imagesLoadedCounter++;
    // console.log("Image count: " + this.imagesLoadedCounter);
    if (this.imagesLoadedCounter === this.imagesLoadedLength) {
      this.isLoading = false;
      this.loaderService._loading$.next(false);
    }
  }

  verifyIfIsFile(path) {
    return path.substring(1, path.length).indexOf('.') > 0;
  }

  onShowFileInput() {
    this.showFileInput = !this.showFileInput;
  }
  
  getDirFromFileRoute(route){
    let splittedRoute =  route.split('/');
    splittedRoute.pop();
    return splittedRoute.join('/');
  }

  isImage(path):Boolean{
    const imageExtensions = ['jpg', 'jpeg', 'gif', 'png'];
    let extension = ((path.substring(BASE_PATH.length, path.length)).split('.'))[(path.substring(BASE_PATH.length, path.length)).split('.').length - 1];
    return imageExtensions.includes(extension);
  }

  showImage(path){
    Swal.fire({
      imageUrl: 'data:image/jpg;base64,'+ path,
      imageWidth: 400,
      imageAlt: 'Custom image',
      showConfirmButton: false
    })
  }

}

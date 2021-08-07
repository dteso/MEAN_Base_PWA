import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FileuploadService } from 'src/app/services/fileupload/fileupload.service';
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

  constructor(
    private readonly fileUploadService: FileuploadService,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
  }

  loadFile(event){
    this.fileToUpload = event.target.files[0];
    console.log(this.fileToUpload);
    if(!this.fileToUpload){ return }
      const reader = new FileReader();
      const url64 = reader.readAsDataURL(this.fileToUpload);
      reader.onloadend = () => {
        console.log(reader.result);
        this.imgTemp = reader.result;
        if(this.fileToUpload.type === "application/pdf") this.isPdf = true;
      }
  }

  uploadFile(){
    console.log("Archivo subido!!!");
    this.fileUploadService.subirArchivo(this.fileToUpload, 'tipo1').then( (img) =>{
      console.log("Imagen subida: " + img );
      this.imgTemp = undefined;
      this. fileToUpload = undefined;
      this.showPrompt();
    } 
  )}

  showPrompt() {
    Toast.fire({
      icon: 'success',
      title: this.translateService.instant('FILE.UPLOAD.SUCESS')
    });
  }

}

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor(
    private readonly storage: StorageService
  ) { }

  async subirArchivo(
    file: File,
    type: string
  ){

    try{

      const url = `${environment.api_url}/upload`;
      const formData = new FormData();
      formData.append('image', file);

      const resp =  await fetch(url, {
        method: 'PUT',
        // headers:{
        //   'x-token': this.storage.getItem('USER').token;
        // },
        body: formData
      });

      const data = await resp.json();

      console.log(data);

      if(data.ok){
        return data.file;
      }else{
        console.log(data.msg);
        return false;
      }

    }catch(err){
      console.log(err);
    }
  }


}

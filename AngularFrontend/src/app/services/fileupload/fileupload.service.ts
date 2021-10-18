import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor(
    private readonly storage: StorageService,
    private readonly apiService: ApiService
  ) { }

  async subirArchivo(
    file: File,
    catalog: string,
    folder: string
  ){
    try{
      const url = `${environment.api_url}/upload`;
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      formData.append('catalog', catalog);
      const resp =  await fetch(url, {
        method: 'PUT',
        headers:{
          'x-token': this.storage.getItem('USER').token
        },
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

  getAllfiles(){
    return this.apiService.get("upload/list");
  }

  deleteFile(uid){
    return this.apiService.delete(`upload/file/${uid}`);
  }

  createFolder(path){
    return this.apiService.post('upload/folder', { folderSrc: path });
  }

  deleteFolder(path){
    return this.apiService.put('upload/folder', { folderSrc: path });
  }

  getStructure(path){
    return this.apiService.post(`upload/structure`,{ path });
  }

  getFilesByFolder(folder){
    const splittedPath = folder.split('/');
    const terminalParam = splittedPath[splittedPath.length-1];
    return this.apiService.get(`upload/list/${terminalParam}`);
  }


}

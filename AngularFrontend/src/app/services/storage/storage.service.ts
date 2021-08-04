import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getItem(key: string){
    return window.sessionStorage[key]? JSON.parse(window.sessionStorage[key]): null;
  }

  setItem(key: string, value: any){
    return window.sessionStorage[key] = JSON.stringify(value);
  }

  clear(key: string){
    return window.sessionStorage.removeItem(key);
  }
}

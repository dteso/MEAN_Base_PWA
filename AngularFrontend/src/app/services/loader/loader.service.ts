import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public readonly _loading$ = new BehaviorSubject<boolean>(true);

  constructor() {
    this._loading$.subscribe( status => {
      // console.log("Loader Status" + status);
    });
   }
}

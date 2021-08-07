import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  
  imagesLoadedCounter = 0;
  imagesLoadedLength = 4;
  isLoading = true;


  constructor(
    private readonly loaderService: LoaderService
    ) { 
      this.loaderService._loading$.next(true);
    }

  ngOnInit(): void { }

  setLoaded(){
    this.imagesLoadedCounter++;
    console.log("Image count: " + this.imagesLoadedCounter);
    if(this.imagesLoadedCounter === this.imagesLoadedLength){
      this.isLoading = false;
      this.loaderService._loading$.next(false);
    }
  }

}

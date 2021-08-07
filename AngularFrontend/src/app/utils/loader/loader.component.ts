import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  isLoading = true;

  constructor(
    private readonly loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.loader._loading$.subscribe(res => {
      this.isLoading = res;
    })
  }



}

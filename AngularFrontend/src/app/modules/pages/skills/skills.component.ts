import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  counter = 0;

  constructor() { }

  ngOnInit(): void {
    setInterval(()=> {
      this.counter++;
    }, 200);
  }

}

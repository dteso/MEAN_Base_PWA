import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user:User = {
    email: "",
    name: "",
    role: "",
    img: "../../assets/person.png",
    google: false,
    uid: ""
  };

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.data
    .subscribe(data => {
      const routeData: any = data;
      //console.log("DATA in resolver: " + JSON.stringify(routeData));
      Object.assign(this.user ,JSON.parse(routeData.data).user);
      //console.log(this.user);
    });
  }
  
  logout(): void {
    this.authService.clearAuth();
    this.router.navigate(['/']);
  }
}

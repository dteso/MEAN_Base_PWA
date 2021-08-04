import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { AuthService } from 'src/app/services/auth/auth.service';

interface Auth{
  name: String;
  password: String;
  email: String;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginUser: Auth;
  socialUser: SocialUser;
  isLoggedin: boolean;
  isGoogleLoggedin: boolean;
  submitted = false;

  registerView = false;
  loginView = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly socialAuthService: SocialAuthService,
    private readonly router: Router
  ) {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isGoogleLoggedin = (user != null);
      //console.log(this.socialUser);
    });
    this.loginForm = this.formBuilder.group({
      name: [{value: '', disabled: this.loginView}, Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
    });
   }

  ngOnInit(): void {
    this.authService.clearAuth();
  }

  register(){
    this.submitted=true;
    if(!this.loginForm.invalid){
      this.loginUser = {
        name: this.loginForm.controls.name.value,
        password: this.loginForm.controls.password.value,
        email: this.loginForm.controls.email.value
      }
      //console.info(this.loginUser);
      this.authService.registerAuth(this.loginUser);
      this.isLoggedin = true;
      this.loginForm.reset();
    }
    return;
  }


  login(){
    this.submitted=true;
    if(!this.loginForm.invalid){
      this.loginUser = {
        name: this.loginForm.controls.name.value,
        password: this.loginForm.controls.password.value,
        email: this.loginForm.controls.email.value
      }
      //console.info(this.loginUser);
      this.authService.tryAuth(this.loginUser);
      this.loginForm.reset();
      this.submitted = false;
    }
    //console.log(this.loginForm);
    return;
  }

  logout(): void {
    this.authService.clearAuth();
    this.isLoggedin = false;
    this.router.navigate(['/']);
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then( res => {
      this.isGoogleLoggedin=true;
      let id_token = res.idToken;
      //console.log("ID_TOKEN: ", id_token);
      this.authService.tryGoogleAuth(id_token);
      this.router.navigate(['/home']);
    });
    
  }

  logOutGoogle(): void {
    this.socialAuthService.signOut();
    this.isGoogleLoggedin=false;
  }

  showRegisterView(){
    this.loginForm.controls.name.setValue('');
    this.loginView = false;
    this.registerView = true;
  }

  showLoginView(){
    this.loginView = true;
    this.registerView = false;
    this.loginForm.controls.name.disable();
  }

  resotoreViews(){
    this.loginView = false;
    this.registerView = false;
  }

}

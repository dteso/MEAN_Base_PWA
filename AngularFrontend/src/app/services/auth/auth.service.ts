import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private readonly isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();
  public currentUser$ = new Observable<any>();
  public currentToken;


  constructor
  (
    private readonly apiService: ApiService,
    private readonly storageService: StorageService,
    private readonly router: Router
  ){}


  get isLoggedIn(){
    // TODO: Sólo se está comprobando que exista un token, no que sea válido.
    if(this.storageService.getItem('USER')){
      this.isAuthenticatedSubject$.next(true);
    }
    return this.isAuthenticated$;
  }

  registerAuth(registerUser){
    this.apiService.post("users",registerUser).subscribe( res=> {
      //console.log(res);
      this.storageService.setItem("USER",res);
      this.isAuthenticatedSubject$.next(true);
      this.currentUser$ = of(res.user);
      this.currentToken = res.token;
      this.router.navigate(['/home']);
    });
  }

  tryAuth(loginUser){
    this.apiService.post("login", loginUser).subscribe( res=> {
      //console.log(res);
      this.storageService.setItem("USER",res);
      this.isAuthenticatedSubject$.next(true);
      this.currentUser$ = of(res.user);
      this.currentToken = res.token;
      this.router.navigate(['/home']);
    });
  }

  tryGoogleAuth(id_token){
    this.apiService.post("login/google", {id_token}).subscribe( res=> {
      //console.log(res);
      this.storageService.setItem("USER",res);
      this.isAuthenticatedSubject$.next(true);
      this.currentUser$ = of(res.user);
      this.currentToken = res.token;
      this.router.navigate(['/home']);
    });
  }

  clearAuth(){
    this.storageService.clear('USER');
    this.isAuthenticatedSubject$.next(false);
    this.currentUser$ = new Observable<any>();
    this.currentToken = null;
    this.router.navigate(['login']);
  }

}


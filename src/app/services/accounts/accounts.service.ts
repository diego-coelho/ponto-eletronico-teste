import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/consts/api';
import { AccountResponse } from 'src/app/models/AccountResponse';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(private http: HttpClient, private router: Router) {}

  loginUser(email: string, senha: string) {
    return this.http
      .post<AccountResponse>(`${API.URL.ACCOUNTS}`, {
        userID: email,
        accessKey: senha,
        grantType: 'password',
      })
      .pipe(
        tap((res: AccountResponse) => {
          this.setSession(res);
          this.router.navigate(['home']);
        })
      );
  }

  private setSession(authResult: AccountResponse) {
    localStorage.setItem('id_token', authResult.accessToken);
    localStorage.setItem('user_name', authResult.name);
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_name');
    this.router.navigate(['login']);
  }

  public isLoggedIn() {
    return localStorage.getItem('id_token');
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  public userName() {
    return localStorage.getItem('user_name');
  }
}

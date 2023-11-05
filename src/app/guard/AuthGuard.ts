import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AccountsService } from '../services/accounts/accounts.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private accountsService: AccountsService,
    private router: Router
  ) {}

  canActivate() {
    if (this.accountsService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['login']);
    
    return false;
  }
}

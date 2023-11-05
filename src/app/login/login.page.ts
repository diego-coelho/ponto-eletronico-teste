import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from './../services/accounts/accounts.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { ToastService } from './../services/sharedServices/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  isToastOpen = false;

  constructor(
    private fb: FormBuilder,
    private accountsService: AccountsService,
    private router: Router,
    public loadingController: LoadingController,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  setLoading() {
    return 'open-loading';
  }

  setOpenToast(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  ionViewWillEnter() {
    if (this.accountsService.isLoggedIn()) {
      this.setLoading();
      this.router.navigate(['home']);
    }
  }

  authClient() {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach((control) => {
        control.markAsDirty();
        control.markAsTouched();
      });

      this.setOpenToast(true);

      return;
    }
    const { email, senha } = this.loginForm.value;

    this.accountsService.loginUser(email, senha).subscribe({
      error: (err) => {
        this.toastService.open(err.message);
      },
    });
  }
}

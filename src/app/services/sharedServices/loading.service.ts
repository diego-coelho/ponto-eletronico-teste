import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  constructor(public loadingController: LoadingController) {}

  open() {
    this.loadingController
      .create({
        message: 'Loading...',
      })
      .then((response) => {
        response.present();
      });
  }

  close() {
    this.loadingController.dismiss();
  }
}

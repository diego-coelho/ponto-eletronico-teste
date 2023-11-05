import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(public toastController: ToastController) {}

  open(mensagem: string, duration = 3000) {
    this.toastController
      .create({
        message: mensagem,
        duration: duration,
      })
      .then((response) => {
        response.present();
      });
  }

  close() {
    this.toastController.dismiss();
  }
}

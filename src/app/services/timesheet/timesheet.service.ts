import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataResponse } from 'src/app/models/DataResponse';
import { catchError, map, tap } from 'rxjs';
import { API } from 'src/app/consts/api';
import { Timesheet } from './../../models/Timesheet';
import { ToastController } from '@ionic/angular';
import { ToastService } from './../sharedServices/toast.service';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  constructor(private http: HttpClient, private toastService: ToastService) {}

  getAllistTimeSheet() {
    return this.http
      .get<DataResponse<Array<Timesheet>>>(`${API.URL.TIMESHEET}`)
      .pipe(
        catchError((err) => {
          this.toastService.open('Erro ao carregar a lista Timesheet!');
          throw err;
        }),
        map((resp) => {
          return resp;
        })
      );
  }

  cadastrarTimesheet() {
    return this.http
      .post<DataResponse<Array<Timesheet>>>(`${API.URL.TIMESHEET}`, {})
      .pipe(
        catchError((err) => {
          this.toastService.open('Erro ao cadastrar timesheet');
          throw err;
        }),
        map((resp) => resp)
      );
  }

  atualizarTimesheetPorId(timesheetId: number, timesheet: Timesheet) {
    return this.http
      .put<DataResponse<Array<Timesheet>>>(
        `${API.URL.TIMESHEET}/${timesheetId}`,
        timesheet
      )
      .pipe(
        catchError((err) => {
          this.toastService.open('Erro ao cadastrar timesheet');
          throw err;
        }),
        map((resp) => resp)
      );
  }

  deleteTimesheet(timesheetId: number) {
    return this.http
      .delete<DataResponse<string>>(`${API.URL.TIMESHEET}/${timesheetId}`)
      .pipe(
        catchError((err) => {
          this.toastService.open('Erro ao deletar timesheet!');
          throw err;
        })
      );
  }
}

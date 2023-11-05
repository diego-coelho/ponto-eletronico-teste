import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../services/accounts/accounts.service';
import { LoadingController } from '@ionic/angular';
import { TimesheetService } from '../services/timesheet/timesheet.service';
import { Timesheet } from '../models/Timesheet';
import { finalize } from 'rxjs';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  timesheet: Timesheet[] = [];
  currentTimesheet?: Timesheet;
  currentDateTime: Date = new Date();

  constructor(
    private accountsService: AccountsService,
    public loadingController: LoadingController,
    private timesheetService: TimesheetService
  ) {}

  ionViewWillEnter() {
    this.init();

    setInterval(() => {
      this.currentDateTime = new Date();
    }, 3000);
  }

  init() {
    this.timesheetService.getAllistTimeSheet().subscribe((res) => {
      this.timesheet = res.items.map(
        (t) => ({ ...t, tempo: this.calcularTempo(t) } as Timesheet)
      );
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      this.currentTimesheet = this.timesheet.find((t, i, o) => {
        if (!t.start) {
          return false;
        }

        let d = new Date(t.start);
        d.setHours(0, 0, 0, 0);

        return currentDate.getTime() === d.getTime();
      });
    });
  }

  logOut() {
    this.accountsService.logout();
  }

  postStart() {
    this.timesheetService.cadastrarTimesheet().subscribe((res) => {
      this.timesheet = res.items;
      this.init();
    });
  }

  postStartLunch() {
    const timezone = new Date().getTimezoneOffset();
    const date = dayjs().subtract(timezone, 'minutes');

    this.currentTimesheet = {
      ...this.currentTimesheet,
      startLunch: date.toDate(),
    } as Timesheet;

    this.atualizarTimeSheet();
  }

  postEndLunch() {
    const timezone = new Date().getTimezoneOffset();
    const date = dayjs().subtract(timezone, 'minutes');

    this.currentTimesheet = {
      ...this.currentTimesheet,
      endLunch: date.toDate(),
    } as Timesheet;

    this.atualizarTimeSheet();
  }

  postEnd() {
    const timezone = new Date().getTimezoneOffset();
    const date = dayjs().subtract(timezone, 'minutes');

    this.currentTimesheet = {
      ...this.currentTimesheet,
      end: date.toDate(),
    } as Timesheet;

    this.atualizarTimeSheet();
  }

  atualizarTimeSheet() {
    this.timesheetService
      .atualizarTimesheetPorId(
        this.currentTimesheet?.id as number,
        this.currentTimesheet as Timesheet
      )
      .pipe(finalize(() => this.init()))
      .subscribe((res) => {});
  }

  dateTimezone(valor?: Date) {
    if (!valor) return;

    const timezone = new Date().getTimezoneOffset();
    const date = dayjs(valor).add(timezone, 'minutes');

    return date.toDate();
  }

  calcularTempo(timesheet: Timesheet) {
    const timezone = new Date().getTimezoneOffset();
    const dateUtc = dayjs(new Date()).subtract(timezone, 'minutes');

    const v1 = dayjs(
      timesheet.startLunch ? timesheet.startLunch : dateUtc
    ).diff(timesheet.start, 'minutes');

    const v2 = dayjs(timesheet.end ? timesheet.end : dateUtc).diff(
      timesheet.endLunch ? timesheet.endLunch : dateUtc,
      'minutes'
    );

    const total = v1 + v2;

    const HH = Math.floor(total / 60);
    const mm = total % 60;

    return `${String(HH).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }

  get obterTempo() {
    const timezone = new Date().getTimezoneOffset();
    const dateUtc = dayjs(new Date()).subtract(timezone, 'minutes');

    const v1 = dayjs(
      this.currentTimesheet?.startLunch
        ? this.currentTimesheet.startLunch
        : dateUtc
    ).diff(this.currentTimesheet?.start, 'minutes');

    const v2 = dayjs(
      this.currentTimesheet?.end ? this.currentTimesheet?.end : dateUtc
    ).diff(
      this.currentTimesheet?.endLunch
        ? this.currentTimesheet.endLunch
        : dateUtc,
      'minutes'
    );

    const total = v1 + v2;

    const HH = Math.floor(total / 60);
    const mm = total % 60;

    return `${String(HH).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }

  get usuarioLogado() {
    return this.accountsService.userName();
  }

  get date() {
    return Date.now();
  }
}

import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public timeLeft: object = null;
  public dueDate: Date;
  public dueDateTime: Date;
  public displayTimePicker = false;
  public displayDatePicker = false;
  public stopTimer = new Subject();
  constructor(public timePicker: NgxMaterialTimepickerComponent) {
  }
  ngOnInit(): void {
    const cached = localStorage.getItem('dueDate');
    if (cached) {
      this.dueDateTime = new Date(cached);
      this.initTimer();
    } else {
      this.displayDatePicker = true;
    }
  }


  public setDate() {
    this.displayTimePicker = true;
  }

  public setTime(time) {
    this.displayTimePicker = false;
    this.dueDateTime = this.dueDate;
    const timeArr = time.split(':');
    this.dueDateTime.setHours(timeArr[0]);
    this.dueDateTime.setMinutes(timeArr[1]);
    this.storeDate();
    this.initTimer();
  }
  private storeDate() {
    localStorage.setItem('dueDate', this.dueDateTime.toString());
  }
  public isMobile() {
    return window.innerWidth < 700;
  }
  public initTimer() {
    interval(1000).pipe(takeUntil(this.stopTimer)).subscribe(() => {
      this.setTimer();
    });
    this.displayDatePicker = false;
  }
  setTimer(): void {
    const now = new Date().getTime();
    const distance = this.dueDateTime.getTime() - now;

    if (distance < 0) {
      this.timeLeft = null;
      this.stopTimer.next();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString();
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString();
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString();
    const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString();

    function wordTransform(num, doubleOrZero, single) {
      return {
        digit: num,
        word: (+num === 1 || (+num > 20 && num[num.length - 1] === '1') ? ` ${single}` : ` ${doubleOrZero}`)
      };
      // return num + (+num === 1 || (+num > 20 && num[num.length - 1] === '1') ? ` ${single}` : ` ${doubleOrZero}`);
    }

    this.timeLeft = {
      days : wordTransform(days, 'days', 'day'),
      hours : wordTransform(hours, 'hours', 'hour'),
      minutes : wordTransform(minutes, 'minutes', 'minute'),
      seconds : wordTransform(seconds, 'seconds', 'second')
    };
  }
  public resetTimer() {
    this.stopTimer.next();
    this.dueDateTime = null;
    this.timeLeft = null;
    this.displayDatePicker = true;
    localStorage.removeItem('dueDate');
  }
}



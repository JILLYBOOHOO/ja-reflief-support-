import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertOptions, AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  alert: AlertOptions | null = null;
  private sub = new Subscription();

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.sub.add(this.alertService.alert$.subscribe(a => {
      this.alert = a;
    }));
  }

  close() {
    if (this.alert && this.alert.onClose) {
      this.alert.onClose();
    }
    this.alertService.close();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

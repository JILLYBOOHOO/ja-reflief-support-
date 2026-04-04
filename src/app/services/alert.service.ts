import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  btnText?: string;
  onClose?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSource = new Subject<AlertOptions | null>();
  alert$ = this.alertSource.asObservable();

  show(options: AlertOptions) {
    this.alertSource.next(options);
  }

  success(title: string, message: string) {
    this.show({ type: 'success', title, message });
  }

  error(title: string, message: string) {
    this.show({ type: 'error', title, message });
  }

  warning(title: string, message: string) {
    this.show({ type: 'warning', title, message });
  }

  info(title: string, message: string) {
    this.show({ type: 'info', title, message });
  }

  close() {
    this.alertSource.next(null);
  }
}

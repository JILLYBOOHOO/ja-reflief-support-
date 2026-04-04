import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AccessibilityService, FontSize } from './services/accessibility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isOnline: boolean = true;
  showCookieBanner = true;
  isDashboard = false;
  currentFontSize: FontSize = 'normal';

  constructor(private router: Router, private accessibilityService: AccessibilityService) {
    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => this.isOnline = true);
    window.addEventListener('offline', () => this.isOnline = false);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.isDashboard = url.includes('/dashboard');
    });

    this.accessibilityService.fontSize$.subscribe(size => {
      this.currentFontSize = size;
    });
  }

  ngOnInit() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      this.showCookieBanner = false;
    }
  }

  acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    this.showCookieBanner = false;
  }
}

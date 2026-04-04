import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type FontSize = 'normal' | 'large' | 'huge';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private fontSizeSubject = new BehaviorSubject<FontSize>('normal');
  fontSize$ = this.fontSizeSubject.asObservable();

  private audioEnabledSubject = new BehaviorSubject<boolean>(true);
  isAudioEnabled$ = this.audioEnabledSubject.asObservable();

  constructor() {
    const savedSize = localStorage.getItem('fontSize') as FontSize;
    if (savedSize) {
      this.fontSizeSubject.next(savedSize);
    }

    const savedAudio = localStorage.getItem('audioEnabled');
    if (savedAudio !== null) {
      this.audioEnabledSubject.next(savedAudio === 'true');
    }
  }

  setFontSize(size: FontSize) {
    this.fontSizeSubject.next(size);
    localStorage.setItem('fontSize', size);
  }

  toggleAudio() {
    const newState = !this.audioEnabledSubject.value;
    this.audioEnabledSubject.next(newState);
    localStorage.setItem('audioEnabled', String(newState));
    return newState;
  }

  get currentFontSize(): FontSize {
    return this.fontSizeSubject.value;
  }

  get isAudioEnabled(): boolean {
    return this.audioEnabledSubject.value;
  }
}


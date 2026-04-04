import { Component, OnInit } from '@angular/core';
import { AccessibilityService, FontSize } from '../../services/accessibility.service';
import { SpeechService } from '../../services/speech.service';

@Component({
  selector: 'app-accessibility-toolbar',
  templateUrl: './accessibility-toolbar.component.html',
  styleUrls: ['./accessibility-toolbar.component.css']
})
export class AccessibilityToolbarComponent implements OnInit {
  currentSize: FontSize = 'normal';

  constructor(
    public accessibilityService: AccessibilityService,
    public speechService: SpeechService
  ) {}

  ngOnInit() {
    this.accessibilityService.fontSize$.subscribe(size => {
      this.currentSize = size;
    });
  }

  setSize(size: FontSize) {
    this.accessibilityService.setFontSize(size);
    const label = size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'Huge';
    if (this.accessibilityService.isAudioEnabled) {
      this.speechService.speak('Font size set to ' + label);
    }
  }

  toggleAudio() {
    const isEnabled = this.accessibilityService.toggleAudio();
    if (isEnabled) {
        this.speechService.speak('Voice guide enabled.');
    } else {
        this.speechService.speak('Voice guide disabled.');
    }
  }


  toggleVoice() {
    this.speechService.toggleListening();
  }
}

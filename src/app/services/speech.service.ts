import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpeechService {
    private recognition: any;
    private isListeningSource = new Subject<boolean>();
    isListening$ = this.isListeningSource.asObservable();
    private lastProcessedIndex = -1;

    constructor(private router: Router, private zone: NgZone) {
        const { webkitSpeechRecognition }: any = window;
        if (webkitSpeechRecognition) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event: any) => {
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal && i > this.lastProcessedIndex) {
                        this.lastProcessedIndex = i;
                        const command = event.results[i][0].transcript.toLowerCase().trim();
                        console.log('Voice command received:', command);
                        this.handleCommand(command);
                    }
                }
            };

            this.recognition.onend = () => {
                this.isListeningSource.next(false);
            };
        }
    }

    private getNaturalVoice(): SpeechSynthesisVoice | null {
        const voices = window.speechSynthesis.getVoices();
        // Look for "Google" or "Premium" or just specific English variants
        return voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
            voices.find(v => v.name.includes('Natural') && v.lang.startsWith('en')) ||
            voices.find(v => v.lang.startsWith('en')) ||
            voices[0] || null;
    }

    speak(text: string): void {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Clear any pending speech
            const utterance = new SpeechSynthesisUtterance(text);
            const voice = this.getNaturalVoice();
            if (voice) utterance.voice = voice;
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    }

    toggleListening(): void {
        if (!this.recognition) return;

        if (this.isListeningSource.observed && (this.recognition as any).started) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    private fieldResultSource = new Subject<string>();
    fieldResult$ = this.fieldResultSource.asObservable();

    private isFieldInputMode = false;

    startFieldInput(): void {
        if (!this.recognition) return;
        this.isFieldInputMode = true;
        this.startListening();
    }

    stopFieldInput(): void {
        this.isFieldInputMode = false;
        this.stopListening();
    }

    private startListening(): void {
        try {
            if ((this.recognition as any).started) return;
            this.lastProcessedIndex = -1; // Reset to prevent processing old results
            this.recognition.start();
            (this.recognition as any).started = true;
            this.isListeningSource.next(true);
            if (!this.isFieldInputMode) this.speak('Voice navigation enabled.');
        } catch (e) {
            console.error('Speech recognition error:', e);
        }
    }

    private stopListening(): void {
        if (this.recognition) {
            this.recognition.abort();
            (this.recognition as any).started = false;
        }
        if (!this.isFieldInputMode) window.speechSynthesis.cancel();
        this.isListeningSource.next(false);
        if (!this.isFieldInputMode) this.speak('Voice navigation disabled.');
    }

    private handleCommand(command: string): void {
        const input = command.toLowerCase();
        console.log('Voice engine identifying command:', input);

        if (this.isFieldInputMode) {
            this.zone.run(() => {
                this.fieldResultSource.next(input);
                this.stopFieldInput();
            });
            return;
        }

        this.zone.run(() => {
            // Enhanced keyword matching
            if (input.includes('home')) {
                this.router.navigate(['/']);
                this.speak('Navigating home');
            } else if (input.includes('wifi') || input.includes('eifi') || input.includes('wi fi') || input.includes('voucher')) {
                this.router.navigate(['/wifi-access']);
                this.speak('Opening WiFi access');
            } else if (input.includes('donate')) {
                this.router.navigate(['/donate']);
                this.speak('Opening donation page');
            } else if (input.includes('login') || input.includes('log in')) {
                this.router.navigate(['/login']);
                this.speak('Opening login page');
            } else if (input.includes('dashboard') || input.includes('dash board')) {
                this.router.navigate(['/dashboard']);
                this.speak('Opening dashboard');
            } else if (input.includes('register')) {
                this.router.navigate(['/register']);
                this.speak('Opening registration');
            } else if (input.includes('emergency') || input.includes('information') || input.includes('help')) {
                this.router.navigate(['/information']);
                this.speak('Opening emergency information');
            } else if (input.includes('privacy')) {
                this.router.navigate(['/privacy']);
                this.speak('Opening privacy statement');
            } else if (input.includes('sitemap')) {
                this.router.navigate(['/sitemap']);
                this.speak('Opening site map');
            } else if (input.includes('scroll down')) {
                window.scrollBy({ top: 500, behavior: 'smooth' });
                this.speak('Scrolling down');
            } else if (input.includes('scroll up')) {
                window.scrollBy({ top: -500, behavior: 'smooth' });
                this.speak('Scrolling up');
            } else if (input.includes('submit') || input.includes('confirm') || input.includes('pantry request')) {
                const submitBtn = document.querySelector('button[type="submit"], .submit-btn, .signature-gradient') as HTMLElement;
                if (submitBtn) {
                    submitBtn.click();
                    this.speak('Submitting form');
                }
            } else if (input.includes('back')) {
                window.history.back();
                this.speak('Going back');
            } else {
                console.log('No command matched for:', input);
            }
        });
    }
}

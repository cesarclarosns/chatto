import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from 'src/app/components/layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-marketing-home',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  templateUrl: './marketing-home.component.html',
  styleUrls: ['./marketing-home.component.sass'],
})
export class MarketingHomeComponent implements OnInit {
  @ViewChild('phraseElement') phraseRef!: ElementRef;

  phrase!: string[];

  phrasesIndex = 0;
  phrases = [
    ['Talk to', 'strangers!'],
    ['Get better', 'at talking!'],
    ['Meet', 'new friends!'],
  ];

  constructor() {}

  ngOnInit(): void {
    this.switchPhrase();
  }

  switchPhrase() {
    console.log({
      phraseRef: this.phraseRef,
    });
    console.log('Switching phrase');
    this.phrase = this.phrases[this.phrasesIndex];
    if (this.phrasesIndex == this.phrases.length - 1) {
      this.phrasesIndex = 0;
    } else {
      this.phrasesIndex++;
    }

    setTimeout(() => {
      this.switchPhrase();
    }, 3000);
  }
}

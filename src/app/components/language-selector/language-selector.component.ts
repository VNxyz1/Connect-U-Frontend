import { Component, OnInit } from '@angular/core';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language/language.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [DropdownModule, FormsModule, AsyncPipe],
  templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent implements OnInit {
  activeLanguage$!: Observable<string>;

  constructor(protected languageService: LanguageService) {}

  ngOnInit(): void {
    this.activeLanguage$ = this.languageService.getActiveLanguage();
  }

  changeLanguage($event: DropdownChangeEvent) {
    this.languageService.setActiveLanguage($event.value);
  }
}

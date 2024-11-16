import { Component } from '@angular/core';
import { EventCardComponent } from '../../components/event-card/event-card.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [EventCardComponent],
  templateUrl: './search-page.component.html',
})
export class SearchPageComponent {}

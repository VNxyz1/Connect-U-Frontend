import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { List, ListService } from '../../../../services/lists/list.service';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { AsyncPipe } from '@angular/common';
import { CreateListComponent } from './create-list/create-list.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-overview-page',
  standalone: true,
  imports: [
    AngularRemixIconComponent,
    AsyncPipe,
    CreateListComponent,
    RouterLink,
  ],
  templateUrl: './list-overview-page.component.html',
})
export class ListOverviewPageComponent {
  @Input()
  set id(id: string) {
    this.eventId = id;
  }

  eventId!: string;
  lists$!: Observable<List[]>;

  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.lists$ = this.listService.getLists(this.eventId);
  }
}

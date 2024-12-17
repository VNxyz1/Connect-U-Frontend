import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { List, ListService } from '../../../../services/lists/list.service';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { AsyncPipe } from '@angular/common';
import { CreateListComponent } from './create-list/create-list.component';
import { RouterLink } from '@angular/router';
import { SocketService } from '../../../../services/socket/socket.service';

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
export class ListOverviewPageComponent implements OnInit {
  @Input()
  set id(id: string) {
    this.eventId = id;
  }

  private _listSubject$!: BehaviorSubject<List[]>;

  eventId!: string;
  lists$!: Observable<List[]>;

  constructor(
    private listService: ListService,
    private sockets: SocketService,
  ) {}

  ngOnInit(): void {
    this.listService.getLists(this.eventId).subscribe({
      next: res => {
        this._listSubject$ = new BehaviorSubject<List[]>(res);
        this.lists$ = this._listSubject$.asObservable();
      },
    });

    this.sockets.on('updateListOverview').subscribe({
      next: () => {
        this.getAndSetLists();
      },
    });
  }

  getAndSetLists() {
    this.listService.getLists(this.eventId).subscribe({
      next: res => this._listSubject$.next(res),
    });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ListDetail,
  ListService,
} from '../../../../services/lists/list.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-list-detail-page',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './list-detail-page.component.html',
})
export class ListDetailPageComponent implements OnInit {
  @Input()
  set listId(listId: number) {
    this._listId = listId;
  }

  listDetail$!: Observable<ListDetail>;

  _listId!: number;

  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.listDetail$ = this.listService.getListDetail(this._listId);
  }
}

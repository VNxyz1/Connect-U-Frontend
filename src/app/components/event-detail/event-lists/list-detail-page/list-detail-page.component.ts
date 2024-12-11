import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ListDetail,
  ListService,
} from '../../../../services/lists/list.service';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-list-detail-page',
  standalone: true,
  imports: [
    AsyncPipe,
    CheckboxModule,
    Button,
    AngularRemixIconComponent,
    SkeletonModule,
    NgOptimizedImage,
  ],
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

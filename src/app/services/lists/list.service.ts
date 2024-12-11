import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type CreateListRes = {
  ok: boolean;
  message: string;
  listId: number;
};

export type CreateListBody = {
  title: string;
  description?: string;
};

export type List = {
  id: number;
  title: string;
  description: string;
  creator: {};
  listEntriesNumber: number;
};

export type ListDetail = {
  id: number;
  title: string;
  description: string;
  creator: {};
  listEntries: ListEntry[];
};

export type ListEntry = {
  id: number;
  timestamp: string;
  content: string;
  user: {} | null;
};

@Injectable({
  providedIn: 'root',
})
export class ListService {
  constructor(private http: HttpClient) {}

  postNewList(
    eventId: string,
    body: CreateListBody,
  ): Observable<CreateListRes> {
    return this.http.post<CreateListRes>('list/' + eventId, body);
  }

  getLists(eventId: string): Observable<List[]> {
    return this.http.get<List[]>('list/event/' + eventId);
  }

  getListDetail(listId: number): Observable<ListDetail> {
    return this.http.get<ListDetail>('list/listDetails/' + listId);
  }
}

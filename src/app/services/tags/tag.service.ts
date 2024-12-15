import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface GetTagDTO {
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch tags by search query.
   * @param tagSearch Search string to filter tags
   */
  getAllTags(tagSearch: string): Observable<string[]> {
    return this.http
      .get<GetTagDTO[]>(`tags/search?tagSearch=${tagSearch}`)
      .pipe(map((tags) => tags.map((tag) => tag.title)));
  }
}

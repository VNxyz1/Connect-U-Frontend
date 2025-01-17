import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface GetTagDTO {
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class CityService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch cities by search query.
   * @param postalCode Search by postal code (optional).
   * @param name Search by city name (optional).
   *
   * @param page - number of pages
   * @param pageSize - size of page
   * @returns An observable of cities, with only postalCode and name.
   */

  getCities(postalCode?: string, name?: string,  page = 1, pageSize = 50): Observable<{ postalCode: string; name: string }[]> {
    const params: any = { page, pageSize };

    if (postalCode) {
      params.postalCode = postalCode;
    }

    if (name) {
      params.name = name;
    }

    return this.http
      .get<any[]>(`city/localities`, { params })
      .pipe(
        map(localities =>
          localities.map(locality => ({
            postalCode: locality.postalCode,
            name: locality.name,
          }))
        )
      );
  }
}

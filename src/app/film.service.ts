import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Film } from './film';
import { FilmDBAnalyticsAndPaging } from './film-db-analytics-and-paging.type';
import { IFilmProxy } from './film-proxy.type';
import { IPaging } from './paging.type';

@Injectable()
export class FilmService {
    private baseURL = '/api/films2/';

    private _subject = new Subject<IPaging>();
    public event = this._subject.asObservable();

    public publish(data: IPaging) {
        this._subject.next(data);
    }

    constructor(
        private http: HttpClient
    ) {
    }

    public getById(id: number): Observable<IFilmProxy> {
        return this.http.get<IFilmProxy>(this.baseURL + 'proxy/' + id.toString());
    }

    public paged(search: string, page: number, pageSize: number): Observable<FilmDBAnalyticsAndPaging> {
        let url: string;
        if (search === '') {
          url = `${this.baseURL}paged/descending/${page}/${pageSize.toString()}`;
        } else {
          url = `${this.baseURL}paged/descending/${page}/${pageSize.toString()}/${search}`;
        }
        return this.http.get<FilmDBAnalyticsAndPaging>(url);
    }

    public noPoster(page: number, pageSize: number) {
        return this.http.get(this.baseURL + 'NoPoster/' + page + '/' + pageSize);
    }

    public pagedProxy(search: string, page: number, pageSize: number): Observable<FilmDBAnalyticsAndPaging> {
        let tempsearchUrl: string;
        if (search === '') {
            tempsearchUrl = this.baseURL + 'ProxyPaged/descending/' + page + '/' + pageSize;
        } else {
            tempsearchUrl = this.baseURL + 'ProxyPaged/descending/' + page + '/' + pageSize + '/' + search;
        }
        return this.http.get<FilmDBAnalyticsAndPaging>(tempsearchUrl);
    }

    public delete(movieId: number) {
        return this.http.delete(`${this.baseURL}delete/${movieId}`).subscribe();
    }

    public add(film: Film): Promise<any> {
        return this.http.post(`${this.baseURL}Post`, film).toPromise();
    }

    public edit(film: Film): Promise<any> {
        return this.http.put(`${this.baseURL}Put`, film).toPromise();
    }

    public getIMDBnumber(url: string): string {
        const regex = /([0-9]+)[\/]*\s*$/;
        if (url.match(regex)) {
            return `tt${url.match(regex)[1]}`;
        } else {
            return undefined;
        }
    }
}

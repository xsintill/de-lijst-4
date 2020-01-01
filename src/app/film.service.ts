import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { DbAnalyticsService } from './db-analytics.service';
import { Film, IFilmDBAnalytics, IFilmProxy } from './film.model';
import { PagingService } from './paging.service';

export interface IPaging {
    PagingCount: number;
    PageNo: number;
    PageSize: number;
    TotalRecordCount: number;
}

@Injectable()
export class FilmService {
    private baseURL = '/api/films2/';

    // public dbAnalytics1: Observable<any> =  Observable.create((obs) => {
    //     let ana: IFilmDBAnalytics = {
    //         MoviesInDBCount: undefined,
    //         MoviesSeenCount: undefined,
    //         MoviesSeenInDBSinceCrashCount: undefined,
    //         MoviesSeenNotInDBCount: undefined
    //     }
    //     obs.next(ana);
    //     // obs.complete();
    // });
    // public dbAnalyticsMerged: Subject<any> = new Subject();
    // public dbAnalytics2: Observable<any>;


    public _subject = new Subject<IPaging>();
    public event = this._subject.asObservable();

    public publish(data: IPaging) {
        this._subject.next(data);
    }

    constructor(
        private http: HttpClient,
        private dbAnalyticsService: DbAnalyticsService
        ,
        private pagingService: PagingService
    ) {
    }

    public getById(id: number): Observable<IFilmProxy> {
        return this.http.get<IFilmProxy>(this.baseURL + 'proxy/' + id.toString());
    }

    public paged(pageSize: number, search: string): any {
        let url: string;
        if (search === '') {
          url = this.baseURL + 'paged/descending/1/' + pageSize.toString();
        } else {
          url = this.baseURL + 'paged/descending/1/' + pageSize.toString() + '/' + search;
        }
        return this.http
            .get(url)
            .toPromise()
            .then((response: IFilmDBAnalytics & { Paging: IPaging } ) => {
                const ana: IFilmDBAnalytics = { ...response };
                const paging: IPaging = { ...response.Paging };
                
                this.pagingService.publish(paging);
                this.dbAnalyticsService.publish(ana);
                return response;
            });
    }

    public noPoster(page: number, pageSize: number) {
        return this.http.get(this.baseURL + 'NoPoster/' + page + '/' + pageSize);
    }

    public pagedProxy(search: string, page: number, pageSize: number) {
        let tempsearchUrl: string;
        if (search === '') {
            tempsearchUrl = this.baseURL + 'ProxyPaged/descending/' + page + '/' + pageSize;

        } else {
            tempsearchUrl = this.baseURL + 'ProxyPaged/descending/' + page + '/' + pageSize + '/' + search;
        }
        return this.http.get(tempsearchUrl).toPromise();
    }

    public delete(movieId: number) {
        return this.http.delete(`${this.baseURL}delete/${movieId}`).subscribe(() => {

        });
    }

    public add(film: Film): Promise<any> {
        return this.http.post(`${this.baseURL}Post`, film).toPromise();
    }

    public edit(film: Film): Promise<any> {
        return this.http.put(`${this.baseURL}Put`, film).toPromise();
    }

    public getIMDBnumber(url: string): string {
        const regex = /[0-9]+$/g;
        return `tt${url.match(regex)[0]}`;
    }
}


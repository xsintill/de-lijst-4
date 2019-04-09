// import { HttpClient } from "@angular/common/http";
// import { Http } from "@angular/http";
import { HttpClient, HttpParams } from "@angular/common/http";

// import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

import { PagingService } from "./paging.service";
// import { log } from "util";
import { DbAnalyticsService } from "./db-analytics.service";
import { Film, IFilmDBAnalytics, IFilmProxy } from "./film.model";

export interface IPaging {
    PagingCount: number;
    PageNo: number;
    PageSize: number;
    TotalRecordCount: number;
}

@Injectable()
export class FilmService {
    private baseURL = "http://localhost:65395/api/films2/";

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
        // private http: Http,
        private http: HttpClient,
        private dbAnalyticsService: DbAnalyticsService
        ,
        private pagingService: PagingService
    ) {
    }

    public getById(id: number): Promise<IFilmProxy> {
        return this.http
            .get(this.baseURL + "proxy/" + id.toString())
            .toPromise()
            .then((response: any) => response._body);
    }

    public paged(pageSize: number, search: string): any {
        let url: string;
        if (search === "") {
          url = this.baseURL + "paged/descending/1/" + pageSize.toString();
        } else {
          url = this.baseURL + "paged/descending/1/" + pageSize.toString() + "/" + search;
        }
        return this.http
            .get(url)
            .toPromise()
            .then((response: IFilmDBAnalytics & { Paging: IPaging } ) => {
                console.log("repsonse", response);
                // response.
                // const json = response.json();

                // const ana: IFilmDBAnalytics = {
                //     MoviesInDBCount: json.MoviesInDBCount,
                //     MoviesSeenCount: json.MoviesSeenCount,
                //     MoviesSeenInDBSinceCrashCount: json.MoviesSeenInDBSinceCrashCount,
                //     MoviesSeenNotInDBCount: json.MoviesSeenNotInDBCount
                // };
                const ana: IFilmDBAnalytics = {
                    MoviesInDBCount: response.MoviesInDBCount,
                    MoviesSeenCount: response.MoviesSeenCount,
                    MoviesSeenInDBSinceCrashCount: response.MoviesSeenInDBSinceCrashCount,
                    MoviesSeenNotInDBCount: response.MoviesSeenNotInDBCount
                };
                // const paging: IPaging = {
                //     PageNo: response.Paging.PageNo,
                //     PageSize: json.Paging.PageSize,
                //     PagingCount: json.Paging.PagingCount,
                //     TotalRecordCount: json.Paging.TotalRecordCount
                // };
                const paging: IPaging = {
                    PageNo: response.Paging.PageNo,
                    PageSize: response.Paging.PageSize,
                    PagingCount: response.Paging.PagingCount,
                    TotalRecordCount: response.Paging.TotalRecordCount
                };
                this.pagingService.publish(paging);
                this.dbAnalyticsService.publish(ana);
                return response;
            });
    }

    public noPoster(page: number, pageSize: number) {
        return this.http.get(this.baseURL + "NoPoster/" + page + "/" + pageSize);
    }

    public pagedProxy(search: string, page: number, pageSize: number) {
        let tempsearchUrl: string;
        if (search === "") {
            tempsearchUrl = this.baseURL + "ProxyPaged/descending/" + page + "/" + pageSize;

        } else {
            tempsearchUrl = this.baseURL + "ProxyPaged/descending/" + page + "/" + pageSize + "/" + search;
        }
        return this.http.get(tempsearchUrl).toPromise();
    }

    public delete(movieId: number) {
        console.log(movieId);
        const params = new HttpParams().set("movieId", movieId.toString());
        return this.http.delete(`${this.baseURL}delete`, {params}).subscribe(() => {
            console.log(2);
        });
    }

    public add(film: Film): Promise<any> {
        return this.http.post(`${this.baseURL}Post`, film).toPromise();
    }
}


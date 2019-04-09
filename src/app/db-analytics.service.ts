import { Subject } from "rxjs";
// import { IFilmDBAnalytics } from "./film.model";
import { Injectable } from "@angular/core";

@Injectable()
export class DbAnalyticsService {
    // private DbAnalytics: IFilmDBAnalytics = {
    //     MoviesInDBCount: 0,
    //     MoviesSeenCount: 0,
    //     MoviesSeenInDBSinceCrashCount: 0,
    //     MoviesSeenNotInDBCount: 0
    // };
    public _subject = new Subject<object>();
    public event = this._subject.asObservable();

    public publish(data: any) {
        this._subject.next(data);
    }
}

import { Subject } from "rxjs";
import { IPaging } from "./film.service";
import { Injectable } from "@angular/core";

@Injectable()
export class PagingService {
    // private Paging: IPaging = {
    //     PageNo: 0,
    //     PageSize: 0,
    //     PagingCount: 0,
    //     TotalRecordCount: 0
    // };
    public _subject = new Subject<IPaging>();
    public event = this._subject.asObservable();

    public publish(data: any) {
        this._subject.next(data);
    }
}

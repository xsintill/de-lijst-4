import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DbAnalyticsService {
    public _subject = new Subject<object>();
    public event = this._subject.asObservable();

    public publish(data: any) {
        this._subject.next(data);
    }
}

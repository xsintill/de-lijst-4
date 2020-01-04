import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { IPaging } from './paging.type';

@Injectable()
export class PagingService {
    public _subject = new Subject<IPaging>();
    public event = this._subject.asObservable();

    public publish(data: any) {
        this._subject.next(data);
    }
}
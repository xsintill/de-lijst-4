import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { ViewFilm } from '../list-page/list-page.type';

export class VirtualListConnector extends DataSource<ViewFilm | undefined>  {
  private _pageSize = 10;
  private _subscription = new Subscription();
  private _cachedData: ViewFilm[] | undefined = [];

  private _dataStream = new BehaviorSubject<ViewFilm[] | undefined>(this._cachedData);
  public _fetchedPages = new Set<number>();
  public searchTerm: string;
  // Put the IPresentable{className} properties here you need defaults for
  constructor(public onSearch: EventEmitter<[string, number, number]>){
    super();
  }

  public connect(collectionViewer: CollectionViewer): Observable<ViewFilm[] | undefined> {
    this._subscription.add(collectionViewer.viewChange.subscribe((range) => {
      const startPage = this._getPageForIndex(range.start);
      const endPage = this._getPageForIndex(range.end - 1);
      for (let i = startPage; i <= endPage; i++) {
        this.fetchPage(this.searchTerm, i);
      }
    }));
    return this._dataStream;
  }

  disconnect(): void {
    this._subscription.unsubscribe();
  }

  _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  public fetchPage(searchTerm: string, page: number, refetch: boolean = false) {
    if (this._fetchedPages.has(page) || !refetch) {
      return;
    }
    this._fetchedPages.add(page);

    this.onSearch.emit([searchTerm, page + 1, this._pageSize]);
    this._dataStream.next(this._cachedData);
    // this.onSearch.emit([searchTerm, page + 1, this._pageSize]).subscribe(
    //   (response: FilmDBAnalyticsAndPaging) => {
    //     const films = [...response.Data];
    //     this.getPosterPaths(films);
    //     this.pagingService.publish({ ...response.Paging });
    //     this.dbAnalyticsService.publish({ ...response });
    //     if (response.Paging.TotalRecordCount !== this._length) {
    //       this._cachedData = Array.from<ViewFilm>({ length: response.Paging.TotalRecordCount });
    //     }
    //     this._cachedData.splice(page * this._pageSize, this._pageSize, ...films);
    //     this._dataStream.next(this._cachedData);
    //     // this.presenter.createPresentable(this.presentable, response.Data);
    //   });
  }

}

import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { DbAnalyticsService } from '../db-analytics.service';
import { FilmDBAnalyticsAndPaging } from '../film-db-analytics-and-paging.type';
import { FilmService } from '../film.service';
import { IFilm } from '../film.type';
import { PagingService } from '../paging.service';
import { ITMDBMovie } from '../tmdb-movie.type';
import { TMDBService } from '../tmdb.service';
import { ViewFilm } from './virtual-list.type';

export class VirtualListConnector extends DataSource<ViewFilm | undefined>  {
  private _length = 10;
  private _pageSize = 10;
  private _subscription = new Subscription();
  private _cachedData: ViewFilm[] | undefined = [];

  private _dataStream = new BehaviorSubject<ViewFilm[] | undefined>(this._cachedData);
  public _fetchedPages = new Set<number>();
  public searchTerm = '';
  public currentPageIndex: number;
  public refetch: boolean;
  // Put the IPresentable{className} properties here you need defaults for
  constructor(
    public filmService: FilmService,
    public tmdbService: TMDBService,
    private dbAnalyticsService: DbAnalyticsService,
    private pagingService: PagingService,
    public onSearch: EventEmitter<[string, number, number]>,
    public cdr: ChangeDetectorRef) {
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

  public startNewSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this._fetchedPages.clear();
    this.currentPageIndex = 0;
    this.fetchPage(searchTerm, 0);

  }

  public fetchPage(searchTerm: string, page: number) {
    if (this._fetchedPages.has(page)) {
      return;
    }
    this._fetchedPages.add(page);
    this.currentPageIndex = page ;
    this.onSearch.emit([searchTerm, page + 1, this._pageSize]);
  }

  public setPageResult(pagedResult: FilmDBAnalyticsAndPaging) {
    if (pagedResult) {
      const films =  [...pagedResult.Data];
      this.getPosterPaths(films);

      this.pagingService.publish({ ...pagedResult.Paging });
      this.dbAnalyticsService.publish({ ...pagedResult });
      if (this.refetch) {
        // clear and resize
        this._cachedData = Array.from<ViewFilm>({length: pagedResult.Paging.TotalRecordCount});
        this.refetch = false;
      } else if (pagedResult.Paging.TotalRecordCount !== this._length) {
        // resize the array
        this._cachedData.length = pagedResult.Paging.TotalRecordCount;
      }
      this._cachedData.splice(this.currentPageIndex * this._pageSize, this._pageSize, ...films);
      this._dataStream.next(this._cachedData);
    }
  }

  private getPosterPaths(films: IFilm[]): void {
    _.each(films, (film: ViewFilm) => {
      if (film && !film.poster_path) {
        const imdbId = this.filmService.getIMDBnumber(film.Url);
        if (imdbId) {
          this.tmdbService.getMovieByImdbId(imdbId).subscribe((movie: ITMDBMovie) => {
            if (movie) {
              film.poster_path = this.tmdbService.getPosterPath('w154', movie.poster_path);
              this.cdr.detectChanges();
            }
          });
        }
      }
    });
  }

}

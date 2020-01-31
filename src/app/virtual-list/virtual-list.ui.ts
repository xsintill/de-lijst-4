import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

// import { DbAnalyticsService } from '../db-analytics.service';
import { ConfirmConfig } from '../dialog/confirm-config.type';
import { DialogService } from '../dialog/dialog.service';
import { FilmDBAnalyticsAndPaging } from '../film-db-analytics-and-paging.type';
import { FilmService } from '../film.service';
import { IFilm } from '../film.type';
// import { ViewFilm } from '../list-page/list-page.type';
// import { PagingService } from '../paging.service';
// import { ITMDBMovie } from '../tmdb-movie.type';
import { TMDBService } from '../tmdb.service';
import { VirtualListPagePresenter } from './virtual-list.presenter';
import { IVirtualPresentableListPage as IPresentableVirtualListPage } from './virtual-list.type';

@Component({
  selector: 'lsn-virtual-list-ui',
  styleUrls: ['virtual-list.ui.scss'],
  templateUrl: 'virtual-list.ui.html',
  providers: [FilmService, TMDBService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-class-suffix
export class VirtualListUi extends DataSource<IFilm | undefined> implements OnChanges, OnInit {

  private _pageSize = 10;
  private _cachedData: IFilm[] | undefined = [];
  public _fetchedPages = new Set<number>();
  private _dataStream = new BehaviorSubject<IFilm[] | undefined>(this._cachedData);
  private _subscription = new Subscription();

  public keyUpSubject = new Subject<KeyboardEvent>();

  public searchPaged: (term: string) => void;
  public searchTerm: string;
  @Input()
  public pagedResult: FilmDBAnalyticsAndPaging;
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  public onDelete: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  public onSearch: EventEmitter<[string, number, number]> = new EventEmitter();

  // private searchTerm: string;
  public presentable: IPresentableVirtualListPage;

  private presenter: VirtualListPagePresenter;
  private readonly unsubscribe = new Subject();

  constructor(
    private filmService: FilmService,
    private tmdbService: TMDBService,

    public dialog: DialogService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.presenter = new VirtualListPagePresenter(this.filmService, this.tmdbService, this.cdr);
    this.presenter.presentable$.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((presentable: IPresentableVirtualListPage) => {
      this.presentable = presentable;
      this.cdr.detectChanges()
    });

    //   keyup$
    // .pipe(
    //   map((i: any) => i.currentTarget.value),
    //   debounceTime(500)
    // )
    // .subscribe(console.log);

    // this.searchPaged = () => {
    //   _.debounce(
    //     () => {
    //       // this.filmService.pagedProxy(term, 1, 10).subscribe((response: FilmDBAnalyticsAndPaging) => {
    //       //   // this.pagingService.publish({ ...response.Paging });
    //       //   // this.dbAnalyticsService.publish({ ...response });
    //       //   this.presenter.createPresentable(this.presentable, response.Data);
    //       // });
    //       this._fetchPage(0, true);
    //     },
    //     300,
    //     {
    //       trailing: true
    //     }
    //   );
    // };

    this.keyUpSubject
      .pipe(debounceTime(300))
      .subscribe((term: KeyboardEvent) => {
        const searchTerm = (term.target as HTMLInputElement).value;
        if (searchTerm !== this.searchTerm) {
          this.searchTerm = searchTerm;
          this._fetchPage(this.searchTerm, 0, true);
        }
      });

  }

  public ngOnInit() {
    this._fetchPage('', 0, true);
  }

  // public search(term: string): void {
  //   this.keyUpSubject.next(term);
  // }
  public connect(collectionViewer: CollectionViewer): Observable<IFilm[] | undefined> {
    this._subscription.add(collectionViewer.viewChange.subscribe((range) => {
      const startPage = this._getPageForIndex(range.start);
      const endPage = this._getPageForIndex(range.end - 1);
      for (let i = startPage; i <= endPage; i++) {
        this._fetchPage(this.searchTerm, i);
      }
    }));
    return this._dataStream;
  }

  public disconnect(): void {
    this._subscription.unsubscribe();
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  public gotoIMDB(imdbUrl: string): void {
    // test if we have http or https protocol. if not add it
    let url = '';
    if (!/^http[s]?:\/\//.test(imdbUrl)) {
      url += 'https://';
    }
    url += imdbUrl;
    window.open(url, '_blank');
  }

  public delete(id: number): void {
    const confirm: ConfirmConfig = {
      title: 'Are you sure you want to delete this movie',
      ok: 'yes',
      close: 'no'
    };
    this.dialog.confirm(confirm).subscribe(() => {
      // this.filmService.delete(id);
      this.onDelete.emit(id);
    });
  }

  public _fetchPage(searchTerm: string, page: number, refetch: boolean = false) {
    if (this._fetchedPages.has(page) || !refetch) {
      return;
    }
    this._fetchedPages.add(page);

    this.onSearch.emit([searchTerm, page + 1, this._pageSize]);

    // this.onSearch.emit([searchTerm, page + 1, this._pageSize]).subscribe(
    //   (response: FilmDBAnalyticsAndPaging) => {
    //     const films = [...response.Data];
    //     this.getPosterPaths(films);
    //     this.pagingService.publish({ ...response.Paging });
    //     this.dbAnalyticsService.publish({ ...response });
    //     if (response.Paging.TotalRecordCount !== this._length) {
    //       this._cachedData = Array.from<IFilm>({ length: response.Paging.TotalRecordCount });
    //     }
    //     this._cachedData.splice(page * this._pageSize, this._pageSize, ...films);
    //     this._dataStream.next(this._cachedData);
    //     // this.presenter.createPresentable(this.presentable, response.Data);
    //   });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.pagedResult) {
      this.presenter.createPresentable(this.presentable, changes.pagedResult.currentValue);
    }
  }

  public edit(id: number): void {
    this.router.navigate([`edit/${id}`]);
  }
}

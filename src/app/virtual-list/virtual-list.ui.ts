import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

// import { DbAnalyticsService } from '../db-analytics.service';
import { ConfirmConfig } from '../dialog/confirm-config.type';
import { DialogService } from '../dialog/dialog.service';
import { FilmDBAnalyticsAndPaging } from '../film-db-analytics-and-paging.type';
import { FilmService } from '../film.service';
import { ViewFilm } from '../list-page/list-page.type';
// import { ViewFilm } from '../list-page/list-page.type';
// import { PagingService } from '../paging.service';
// import { ITMDBMovie } from '../tmdb-movie.type';
import { TMDBService } from '../tmdb.service';
import { VirtualListPagePresenter } from './virtual-list.presenter';
import { IVirtualPresentableListPage as IPresentableVirtualListPage } from './virtual-list.type';
import { VirtualListConnector } from './virtual-list-connector';
// import { VirtualDataSource } from './virtual-data-source';

class VirtualDataSource extends DataSource<string | undefined> {
  private length = 100000;
  private pageSize = 100;
  private cachedData = Array.from<string>({length: this.length});
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<(string | undefined)[]>(this.cachedData);
  private subscription = new Subscription();

  connect(collectionViewer: CollectionViewer): Observable<(string | undefined)[]> {
    this.subscription.add(collectionViewer.viewChange.subscribe(range => {
      const startPage = this.getPageForIndex(range.start);
      const endPage = this.getPageForIndex(range.end - 1);
      for (let i = startPage; i <= endPage; i++) {
        this.fetchPage(i);
      }
    }));
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number) {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    // Use `setTimeout` to simulate fetching data from server.
    setTimeout(() => {
      this.cachedData.splice(page * this.pageSize, this.pageSize,
          ...Array.from({length: this.pageSize})
              .map((_, i) => `Item #${page * this.pageSize + i}`));
      this.dataStream.next(this.cachedData);
    }, Math.random() * 1000 + 200);
  }
}

// tslint:disable-next-line: max-classes-per-file
@Component({
  selector: 'lsn-virtual-list-ui',
  styleUrls: ['virtual-list.ui.scss'],
  templateUrl: 'virtual-list.ui.html',
  providers: [FilmService, TMDBService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-class-suffix
export class VirtualListUi/* implements OnChanges, OnInit*/ {

  // // private _subscription = new Subscription();

  // public keyUpSubject = new Subject<KeyboardEvent>();

  // public searchPaged: (term: string) => void;

  // @Input()
  // public pagedResult: FilmDBAnalyticsAndPaging;
  // // tslint:disable-next-line: no-output-on-prefix
  // @Output()
  // public onDelete: EventEmitter<number> = new EventEmitter();
  // // tslint:disable-next-line: no-output-on-prefix
  // @Output()
  // public onSearch: EventEmitter<[string, number, number]> = new EventEmitter();

  // // private searchTerm: string;
  // public presentable: IPresentableVirtualListPage;

  // private presenter: VirtualListPagePresenter;
  // private readonly unsubscribe = new Subject();
  // public connector: VirtualListConnector;
  public ds: VirtualDataSource;

  constructor(
    // private filmService: FilmService,
    // private tmdbService: TMDBService,

    // public dialog: DialogService,
    // private router: Router,
    // private cdr: ChangeDetectorRef
  ) {
    // this.connector = new VirtualListConnector(this.onSearch);
    this.ds = new VirtualDataSource();
    // this.presenter = new VirtualListPagePresenter(this.filmService, this.tmdbService, this.cdr);
    // this.presenter.presentable$.pipe(
    //   takeUntil(this.unsubscribe)
    // ).subscribe((presentable: IPresentableVirtualListPage) => {
    //   this.presentable = presentable;
      
    //   this.cdr.detectChanges();
    //   if (presentable.firstRun) {
    //     this.presentable.connector.fetchPage('', 0, true);
    //   }
    // });
    // this.presenter.createPresentable(this.presentable, undefined, this.onSearch);

    // this.keyUpSubject
    //   .pipe(debounceTime(300))
    //   .subscribe((term: KeyboardEvent) => {
    //     const searchTerm = (term.target as HTMLInputElement).value;
    //     if (searchTerm !== this.presentable.searchTerm) {
    //       this.presenter.setSearchTerm(this.presentable, searchTerm);
    //       this.connector.fetchPage(searchTerm, 0, true);
    //     }
    //   });
  }

  // public ngOnInit() {
  //   this.connector.fetchPage('', 0, true);

  // }

  // public gotoIMDB(imdbUrl: string): void {
  //   // test if we have http or https protocol. if not add it
  //   let url = '';
  //   if (!/^http[s]?:\/\//.test(imdbUrl)) {
  //     url += 'https://';
  //   }
  //   url += imdbUrl;
  //   window.open(url, '_blank');
  // }

  // public delete(id: number): void {
  //   const confirm: ConfirmConfig = {
  //     title: 'Are you sure you want to delete this movie',
  //     ok: 'yes',
  //     close: 'no'
  //   };
  //   this.dialog.confirm(confirm).subscribe(() => {
  //     // this.filmService.delete(id);
  //     this.onDelete.emit(id);
  //   });
  // }

  // public ngOnChanges(changes: SimpleChanges) {
  //   if (changes.pagedResult) {
  //     this.presenter.createPresentable(this.presentable, changes.pagedResult.currentValue, undefined);
  //   }
  // }

  // public edit(id: number): void {
  //   this.router.navigate([`edit/${id}`]);
  // }
}

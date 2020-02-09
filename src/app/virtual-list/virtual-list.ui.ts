// import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { DbAnalyticsService } from '../db-analytics.service';
import { ConfirmConfig } from '../dialog/confirm-config.type';
import { DialogService } from '../dialog/dialog.service';
import { FilmDBAnalyticsAndPaging } from '../film-db-analytics-and-paging.type';
import { FilmService } from '../film.service';
import { PagingService } from '../paging.service';
import { TMDBService } from '../tmdb.service';
import { VirtualListConnector } from './virtual-list-connector';

@Component({
  selector: 'lsn-virtual-list-ui',
  styleUrls: ['virtual-list.ui.scss'],
  templateUrl: 'virtual-list.ui.html',
  providers: [FilmService, TMDBService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualListUi implements OnChanges, OnInit {

  @ViewChild('searchBox') searchBox: ElementRef;
  public keyUpSubject = new Subject<KeyboardEvent>();

  public searchPaged: (term: string) => void;

  @Input()
  public pagedResult: FilmDBAnalyticsAndPaging;
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  public onDelete: EventEmitter<number> = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  public onSearch: EventEmitter<[string, number, number]> = new EventEmitter();

  public connector: VirtualListConnector;
  public searchTerm: string;

  constructor(
    private filmService: FilmService,
    private tmdbService: TMDBService,
    private dbAnalyticsService: DbAnalyticsService,
    private pagingService: PagingService,
    public dialog: DialogService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.connector = new VirtualListConnector(
      this.filmService, this.tmdbService, this.dbAnalyticsService, this.pagingService, this.onSearch, this.cdr);
  }

  public ngOnInit() {
    this.keyUpSubject
      .pipe(debounceTime(300))
      .subscribe((event: KeyboardEvent) => {
        const searchTerm = (event.target as HTMLInputElement).value;
        if (searchTerm !== this.searchTerm) {
          this.searchTerm = searchTerm;
          this.connector.startNewSearch(searchTerm);
        }
      });
    this.connector.fetchPage('', 0);

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
      this.onDelete.emit(id);
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.pagedResult) {
      this.connector.setPageResult(this.pagedResult);
    }
  }

  public edit(id: number): void {
    this.router.navigate([`edit/${id}`]);
  }
}

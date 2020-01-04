import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DbAnalyticsService } from '../db-analytics.service';
import { ConfirmConfig } from '../dialog/confirm-config.type';
import { DialogService } from '../dialog/dialog.service';
import { FilmDBAnalyticsAndPaging } from '../film-db-analytics-and-paging.type';
import { FilmService } from '../film.service';
import { PagingService } from '../paging.service';
import { TMDBService } from '../tmdb.service';
import { ListPagePresenter } from './list-page.presenter';
import { IPresentableListPage } from './list-page.type';

@Component({
  selector: 'lsn-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
  providers: [FilmService, TMDBService]
})
export class ListPageComponent implements OnInit, AfterViewChecked {
  public searchPaged: (term: string) => void;
  public searchText = new Subject<string>();
  private searchTerm: string;
  public presentable: IPresentableListPage;

  private presenter: ListPagePresenter;
  private readonly unsubscribe = new Subject();

  constructor(
    private filmService: FilmService,
    private tmdbService: TMDBService,
    private cdRef: ChangeDetectorRef,
    public dialog: DialogService,
    private dbAnalyticsService: DbAnalyticsService,
    private pagingService: PagingService,
    private router: Router
  ) {
    this.presenter = new ListPagePresenter(this.filmService, this.tmdbService);
    this.presenter.presentable$.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((presentable: IPresentableListPage) => {
      this.presentable = presentable;
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  public search(term: string): void {
    if (term !== this.searchTerm) {
      this.searchTerm = term;
      this.searchPaged(term);
    }
  }

  public ngOnInit() {
    this.searchPaged = _.debounce(
      (term: string) => {
        this.filmService.paged(10, term).subscribe((response: FilmDBAnalyticsAndPaging) => {
          this.pagingService.publish({ ...response.Paging });
          this.dbAnalyticsService.publish({ ...response });
          this.presenter.createPresentable(this.presentable, response.Data);
        });
      },
      300,
      {
        trailing: true
      }
    );

    this.searchPaged('');
  }

  public gotoIMDB(imdbUrl: string): void {
    // test if we have http or https protocol. if not ad it
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
      this.filmService.delete(id);
    });
  }

  public edit(id: number): void {
    this.router.navigate([`edit/${id}`]);
  }
}

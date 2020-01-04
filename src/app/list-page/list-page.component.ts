import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

import { DbAnalyticsService } from '../db-analytics.service';
import { ConfirmConfig } from '../dialog/confirm-config.type';
import { DialogService } from '../dialog/dialog.service';
import { FilmDBAnalyticsAndPaging } from '../film-db-analytics-and-paging.type';
import { FilmService } from '../film.service';
import { PagingService } from '../paging.service';
import { ITMDBMovie } from '../tmdb-movie.type';
import { TMDBService } from '../tmdb.service';

@Component({
  selector: 'lsn-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
  providers: [FilmService, TMDBService]
})
export class ListPageComponent implements OnInit, AfterViewChecked {
  public fetchedIndexes: number[] = [];
  public searchPaged: (term: string) => void;
  public films: any[] = [];
  public searchText = new Subject<string>();
  private searchTerm: string;

  constructor(
    private filmService: FilmService,
    private tmdbService: TMDBService,
    private cdRef: ChangeDetectorRef,
    public dialog: DialogService,
    private dbAnalyticsService: DbAnalyticsService,
    private pagingService: PagingService,
    private router: Router
  ) { }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  public search(term: string): void {
    if (term !== this.searchTerm) {
      this.searchTerm = term;
      this.fetchedIndexes = [];
      this.searchPaged(term);
    }
  }

  public ngOnInit() {
    this.searchPaged = _.debounce(
      (term: string) => {
        this.filmService.paged(10, term).subscribe((response: FilmDBAnalyticsAndPaging) => {
          console.log('response', response);
          this.pagingService.publish({ ...response.Paging });
          this.dbAnalyticsService.publish({ ...response });
          this.films = response.Data;
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

  public alreadyFetched(i: number) {
    return _.includes(this.fetchedIndexes, i);
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

  public getPosterPath(url: string, i: number) {
    if (i < 10 && !this.alreadyFetched(i)) {
      this.fetchedIndexes.push(i);
      const imdbId = this.filmService.getIMDBnumber(url);
      return this.tmdbService
        .getMovieByImdbId(imdbId)
        .subscribe((movie: ITMDBMovie) => {
          if (movie) {
            const posterPath = this.tmdbService.getPosterPath(
              'w154',
              movie.poster_path
            );
            this.films[i].poster_path = posterPath;
            return posterPath;
          }
          return ``;
        });
    }
    return ``;
  }
}

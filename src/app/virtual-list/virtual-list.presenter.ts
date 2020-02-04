import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import * as _ from 'lodash';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';

import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { FilmDBAnalyticsAndPaging } from '../film-db-analytics-and-paging.type';
import { FilmService } from '../film.service';
import { ViewFilm } from '../list-page/list-page.type';
import { ITMDBMovie } from '../tmdb-movie.type';
import { TMDBService } from '../tmdb.service';
import { VirtualListConnector } from './virtual-list-connector';
import { IVirtualPresentableListPage } from './virtual-list.type';

/**
 *  Presenter for VirtualListPage
 */
export class VirtualListPagePresenter {
  private readonly presentable: Subject<IVirtualPresentableListPage> = new Subject();
  public presentable$: Observable<IVirtualPresentableListPage> = this.presentable.asObservable();
  public dataStream = new BehaviorSubject<ViewFilm[] | undefined>(undefined);


  constructor(private readonly filmService: FilmService, private tmdbService: TMDBService, private cdr: ChangeDetectorRef) { }

  public createPresentable(
    presentableState: IVirtualPresentableListPage,
    pagedResult: FilmDBAnalyticsAndPaging,
    onSearch: EventEmitter<[string, number, number]>): void {
    const presentable = this.determineDefaultOrPreviousState(presentableState);
    if (onSearch) {
      presentable.onSearch = onSearch;
    }
    if (pagedResult) {
      const films = new Array<ViewFilm>(pagedResult.Paging.TotalRecordCount);
      console.log(films.length);
      // films = [...presentable.films];
      films.splice(pagedResult.Paging.PageSize * (pagedResult.Paging.PageNo - 1), pagedResult.Paging.PageSize, ...pagedResult.Data);
      console.log(films);
      presentable.films = _.cloneDeep(films);
      presentable.viewFilms = _.cloneDeep(films);
      this.getPosterPaths(presentable);
      // this.cdr.detectChanges();
      this.presentable.next(presentable);
    } else {
      this.presentable.next(presentable);
    }

  }

  public setSearchTerm(previousPresentable: IVirtualPresentableListPage, searchTerm: string): void {
    const presentable = this.determineDefaultOrPreviousState(previousPresentable);
    presentable.searchTerm = searchTerm;
    this.presentable.next(presentable);
  }

  private getPosterPaths(presentable: IVirtualPresentableListPage): void {
    _.each(presentable.viewFilms, (film: ViewFilm) => {
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

  private determineDefaultOrPreviousState(previousState: IVirtualPresentableListPage): IVirtualPresentableListPage {
    return (previousState === undefined) ?
      { ...this.getDefaultPresentableValues() } :
      {
        ...previousState,
        firstRun: false
      };
  }
  private getDefaultPresentableValues(): IVirtualPresentableListPage {
    
    const presentableState: Partial<IVirtualPresentableListPage> = {
      // connector,
      firstRun: true
    };
    return presentableState as Required<IVirtualPresentableListPage>;
  }
}

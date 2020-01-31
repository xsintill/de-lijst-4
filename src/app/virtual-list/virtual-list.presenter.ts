import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';

import { FilmDBAnalyticsAndPaging } from '../film-db-analytics-and-paging.type';
import { FilmService } from '../film.service';
import { IFilm } from '../film.type';
import { ViewFilm } from '../list-page/list-page.type';
import { ITMDBMovie } from '../tmdb-movie.type';
import { TMDBService } from '../tmdb.service';
import { IVirtualPresentableListPage } from './virtual-list.type';
import { ChangeDetectorRef } from '@angular/core';

/**
 *  Presenter for VirtualListPage
 */
export class VirtualListPagePresenter {

  private readonly presentable: Subject<IVirtualPresentableListPage> = new Subject();
  public presentable$: Observable<IVirtualPresentableListPage> = this.presentable.asObservable();

  constructor(private readonly filmService: FilmService, private tmdbService: TMDBService, private cdr: ChangeDetectorRef) { }

  public createPresentable(presentableState: IVirtualPresentableListPage, pagedResult: FilmDBAnalyticsAndPaging): void {
    const presentable = this.determineDefaultOrPreviousState(presentableState);
    if (pagedResult) {
      presentable.films = _.cloneDeep(pagedResult.Data);
      presentable.viewFilms = _.cloneDeep(pagedResult.Data);
      this.getPosterPaths(presentable);
    }

    this.presentable.next(presentable);
  }

  private getPosterPaths(presentable: IVirtualPresentableListPage): void {
    _.each(presentable.viewFilms, (film: ViewFilm) => {
      if (!film.poster_path) {
        const imdbId = this.filmService.getIMDBnumber(film.Url);
        if (imdbId) {
          this.tmdbService.getMovieByImdbId(imdbId).subscribe((movie: ITMDBMovie) => {
            if (movie) {
              film.poster_path = this.tmdbService.getPosterPath('w154', movie.poster_path);
              this.cdr.detectChanges()
            }
          });
        }
      }
    });
  }

  private determineDefaultOrPreviousState(previousState: IVirtualPresentableListPage): IVirtualPresentableListPage {
    return (previousState === undefined) ?
      { ...this.getDefaultPresentableValues() } :
      { ...previousState };
  }
  private getDefaultPresentableValues(): IVirtualPresentableListPage {
    const presentableState: Partial<IVirtualPresentableListPage> = {
      // Put the IPresentable{className} properties here you need defaults for
    };
    return presentableState as Required<IVirtualPresentableListPage>;
  }
}

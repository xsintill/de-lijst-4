import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';

import { FilmService } from '../film.service';
import { IFilm } from '../film.type';
import { ITMDBMovie } from '../tmdb-movie.type';
import { TMDBService } from '../tmdb.service';
import { IPresentableListPage, ViewFilm } from './list-page.type';

/**
 *  Presenter for ListPage
 */
export class ListPagePresenter {

  private readonly presentable: Subject<IPresentableListPage> = new Subject();
  public presentable$: Observable<IPresentableListPage> = this.presentable.asObservable();

  constructor(private readonly filmService: FilmService, private tmdbService: TMDBService) { }

  public createPresentable(presentableState: IPresentableListPage, films: IFilm[]): void {
    const presentable = this.determineDefaultOrPreviousState(presentableState);
    presentable.films = _.cloneDeep(films);
    presentable.viewFilms = _.cloneDeep(films);
    this.getPosterPaths(presentable);

    this.presentable.next(presentable);
  }

  private getPosterPaths(presentable: IPresentableListPage): void {
    _.each(presentable.viewFilms, (film: ViewFilm) => {
      if (!film.poster_path) {
        const imdbId = this.filmService.getIMDBnumber(film.Url);
        if (imdbId) {
          this.tmdbService.getMovieByImdbId(imdbId).subscribe((movie: ITMDBMovie) => {
            if (movie) {
              film.poster_path = this.tmdbService.getPosterPath('w154', movie.poster_path);
            }
          });
        }
      }
    });
  }

  private determineDefaultOrPreviousState(previousState: IPresentableListPage): IPresentableListPage {
    return (previousState === undefined) ?
      { ...this.getDefaultPresentableValues() } :
      { ...previousState };
  }
  private getDefaultPresentableValues(): IPresentableListPage {
    const presentableState: Partial<IPresentableListPage> = {
      // Put the IPresentable{className} properties here you need defaults for
    };
    return presentableState as Required<IPresentableListPage>;
  }
}

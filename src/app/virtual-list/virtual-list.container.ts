import { ChangeDetectionStrategy, Component,/*, OnInit */
ChangeDetectorRef} from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

import { DbAnalyticsService } from '../db-analytics.service';
import { FilmDBAnalyticsAndPaging } from '../film-db-analytics-and-paging.type';
import { FilmService } from '../film.service';
import { IFilm } from '../film.type';
import { ViewFilm } from '../list-page/list-page.type';
import { PagingService } from '../paging.service';
import { ITMDBMovie } from '../tmdb-movie.type';
import { TMDBService } from '../tmdb.service';

/** @title Virtual scroll with a custom data source */
@Component({
  selector: 'lsn-virtual-list',
  styleUrls: ['virtual-list.container.scss'],
  templateUrl: 'virtual-list.container.html',
  providers: [FilmService, TMDBService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualListComponent /*implements OnInit*/ {
  private _length = 10000;
  private _cachedData: IFilm[] | undefined = [];
  private _dataStream = new BehaviorSubject<IFilm[] | undefined>(this._cachedData);
  pagedResult: FilmDBAnalyticsAndPaging;
  // public ds: MyDataSource;
  constructor(
    private filmService: FilmService,
    private tmdbService: TMDBService,
    private dbAnalyticsService: DbAnalyticsService,
    private pagingService: PagingService,
    private cdr: ChangeDetectorRef
  ) {
    // this.ds = new MyDataSource(this.filmService, this.tmdbService);
  }

  public search(searchTerm: string, page: number, pageSize: number) {
    this.filmService.paged(searchTerm, page , pageSize).subscribe(
      (response: FilmDBAnalyticsAndPaging) => {
        this.pagedResult = {...response};
        this.cdr.detectChanges();
        // const films = [...response.Data];
        // this.getPosterPaths(films);
        // this.pagingService.publish({ ...response.Paging });
        // this.dbAnalyticsService.publish({ ...response });
        // if (response.Paging.TotalRecordCount !== this._length) {
        //   this._cachedData = Array.from<IFilm>({ length: response.Paging.TotalRecordCount });
        // }
        // this._cachedData.splice(page * pageSize, pageSize, ...films);
        // this._dataStream.next(this._cachedData);
        // this.presenter.createPresentable(this.presentable, response.Data);
      });
  }

  // public ngOnInit() {
  //   this.ds.search('');
  // }
  public delete(id: number) {
    this.filmService.delete(id);
  }

  // move to presenter
  private getPosterPaths(films: IFilm[]): void {
    _.each(films, (film: ViewFilm) => {
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

}

import { IFilmDBAnalytics } from './film-db-analytics.type';
import { IFilm } from './film.type';
import { IPaging } from './paging.type';

export type FilmDBAnalyticsAndPaging = IFilmDBAnalytics & { Paging: IPaging } & { Data: IFilm[]};
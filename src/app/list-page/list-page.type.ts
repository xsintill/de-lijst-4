import { IFilm } from '../film.type';

export type ViewFilm = IFilm & { poster_path?: string };

export interface IPresentableListPage {
  films: IFilm[];
  viewFilms: ViewFilm[];
}
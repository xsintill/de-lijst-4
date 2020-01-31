import { IFilm } from '../film.type';
import { ViewFilm } from '../list-page/list-page.type';

export interface IVirtualPresentableListPage {
  films: IFilm[];
  viewFilms: ViewFilm[];
}

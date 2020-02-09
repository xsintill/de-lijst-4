import { EventEmitter } from '@angular/core';

import { IFilm } from '../film.type';
import { VirtualListConnector } from './virtual-list-connector';

export interface IVirtualPresentableListPage {
  films: ViewFilm[];
  viewFilms: ViewFilm[];
  searchTerm: string;
  connector: VirtualListConnector;
  onSearch: EventEmitter<[string, number, number]>;
  firstRun: boolean;
}

export type ViewFilm = IFilm & { poster_path?: string };

export interface IPresentableListPage {
  films: IFilm[];
  viewFilms: ViewFilm[];
}

import { EventEmitter } from '@angular/core';

import { ViewFilm } from '../list-page/list-page.type';
import { VirtualListConnector } from './virtual-list-connector';

export interface IVirtualPresentableListPage {
  films: ViewFilm[];
  viewFilms: ViewFilm[];
  searchTerm: string;
  connector: VirtualListConnector;
  onSearch: EventEmitter<[string, number, number]>;
  firstRun: boolean;
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import * as _ from 'lodash';

import { FilmDBAnalyticsAndPaging } from '../film-db-analytics-and-paging.type';
import { FilmService } from '../film.service';
import { TMDBService } from '../tmdb.service';

/** @title Virtual scroll with a custom data source */
@Component({
  selector: 'lsn-virtual-list',
  styleUrls: ['virtual-list.container.scss'],
  templateUrl: 'virtual-list.container.html',
  providers: [FilmService, TMDBService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualListComponent {
  pagedResult: FilmDBAnalyticsAndPaging;
  constructor(
    private filmService: FilmService,
    private cdr: ChangeDetectorRef
  ) {
  }

  public search(searchTerm: string, page: number, pageSize: number) {
    this.filmService.paged(searchTerm, page , pageSize).subscribe(
      (response: FilmDBAnalyticsAndPaging) => {
        this.pagedResult = {...response};
        this.cdr.detectChanges();
      });
  }
  public delete(id: number) {
    this.filmService.delete(id);
  }
}

import { PagingService } from "../paging.service";
import { IFilmDBAnalytics } from "../film.model";
import { DbAnalyticsService } from "./../db-analytics.service";
import { FilmService, IPaging } from "./../film.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "lsn-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  providers: [
    FilmService
  ]
})
export class FooterComponent implements OnInit {
  public dbAnalytics: IFilmDBAnalytics;
  public filteredFilmsTotal: number;

  constructor(
    public filmService: FilmService,
    public dbAnalyticsService: DbAnalyticsService,
    private pagingService: PagingService
    ) {
      dbAnalyticsService.event.subscribe((data: IFilmDBAnalytics) => {
        if (data) {
           this.dbAnalytics = data;
        }
      });
      this.pagingService.event.subscribe((filteredFilmsTotal: IPaging) => {
        if (filteredFilmsTotal) {
          this.filteredFilmsTotal = filteredFilmsTotal.TotalRecordCount;
        }
      });

  }
    public getTooltip(): string {
      return (this.dbAnalytics) ?
        `Movies seen count: ${this.dbAnalytics.MoviesSeenCount},
         Movies in Database: ${this.dbAnalytics.MoviesInDBCount},
         Movies seen in database since the crash: ${this.dbAnalytics.MoviesSeenInDBSinceCrashCount},
         Movies missing in database: ${this.dbAnalytics.MoviesSeenNotInDBCount}` : "";
    }

  ngOnInit() {
  }
}

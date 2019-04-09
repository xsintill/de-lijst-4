import { ConfirmConfig } from "./../dialog/dialog.service";
import { TMDBMovie } from "../tmdb.service";
import { TMDBService } from "../tmdb.service";
import { FilmService } from "../film.service";
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import * as _ from "lodash";

import { Subject } from "rxjs";
// import { MatDialog } from "@angular/material";
import { DialogService } from "../dialog/dialog.service";

@Component({
  selector: "lsn-list-page",
  templateUrl: "./list-page.component.html",
  styleUrls: ["./list-page.component.scss"],
  providers: [FilmService, TMDBService]
})
export class ListPageComponent implements OnInit, AfterViewChecked  {
  public fetchedIndexes: number[] = [];
  public searchPaged: Function;
  public films: any[] = [];
  public searchText = new Subject<string>();


  constructor(
    private filmService: FilmService,
    private tmdbService: TMDBService,
    private cdRef: ChangeDetectorRef,
    public dialog: DialogService) {

  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  public search(term: string): void {
    this.fetchedIndexes = [];
    this.searchPaged(term);
  }
  public ngOnInit() {
    this.searchPaged = _.debounce((term: string) => {

      this.filmService.paged(10, term)
        .then((response: any) => {
          this.films = response.Data;
        });
    }, 300, {
        "trailing": true
      });

    this.searchPaged("");
  }

  public gotoIMDB(imdbUrl: string): void {
    // test if we have http or https protocol. if not ad it
    let url = "";
    if (!/^http[s]?:\/\//.test(imdbUrl)) {
      url += "http://";
    }
    url += imdbUrl;
    window.open(url, "_blank");
  }

  public alreadyFetched(i: number) {
    return _.includes(this.fetchedIndexes, i);
  }

  public delete(id: number): void {
    const confirm: ConfirmConfig = {
      title: "Are you sure you want to delete this movie",
      ok: "yes",
      close: "no"
    };
    this.dialog.confirm(confirm).subscribe((
      // confirmed
      ) => {
      // if (confirmed) {
        this.filmService.delete(id);
      // }
    });
  }

  public getPosterPath(url: string, i: number) {
    if (i < 10 && !this.alreadyFetched(i)) {
      this.fetchedIndexes.push(i);
      return this.tmdbService.getMovieByImdbId(url.substr(-9)).subscribe(
        (movie: TMDBMovie) => {
          if (movie) {
            const posterPath = this.tmdbService.getPosterPath("w154", movie.poster_path);
            this.films[i].poster_path = posterPath;
            return posterPath;
          }
          return ``;
        });
      }
      return ``;
  }
}

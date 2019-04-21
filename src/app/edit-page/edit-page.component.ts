import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { FilmService } from "../film.service";
import { TMDBMovie, TMDBService } from "../tmdb.service";
import { IFilmProxy } from "../film.model";

@Component({
    selector: "lsn-edit-page",
    templateUrl: "./edit-page.component.html",
    styleUrls: ["./edit-page.component.scss"],
    providers: [TMDBService, FilmService]
})
export class EditPageComponent {
    public movie: TMDBMovie;
    public posterPath: string;
    public data: IFilmProxy;
    constructor(
        private tmdb: TMDBService,
        private filmService: FilmService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        const id = this.route.snapshot.params["id"];
        if (id) {
            this.filmService.getById(id).subscribe((response: IFilmProxy) => {
                this.data = { ...response };
            });
        } else {
            this.data.Id = undefined;
            this.data.Title = undefined;
            this.data.SeenAt = undefined;
            this.data.SeenAt = new Date();
        }
    }


    public retrieveResultsForUrl(): void {
        if (this.data.Url) {
            const imdbId = this.data.Url.slice(-9);
            this.tmdb.getMovieByImdbId(imdbId).subscribe(
                (movie: any) => {
                    this.posterPath = movie.movie_results[0].poster_path;
                }
            );
        }
    }

    public setSeenAtInHistory(): void {
        this.data.SeenAt = this.movie.release_date;
    }
    public retrieveResultsForTitle() {
        if (this.data.Title) {
            this.tmdb.searchMovie(this.data.Title).subscribe((response) => {
                this.tmdb.getMovie(response[0].id).subscribe(
                    (movie: TMDBMovie) => {
                        console.log("movie", movie);
                        if (movie) {
                            this.movie = movie;
                            this.data.Url = `http://www.imdb.com/title/${movie.imdb_id}`;
                            this.posterPath = movie.poster_path;
                        }
                    }
                );
            });
        }
    }
    public openLink(): void {
        window.open(this.data.Url);
    }
    public saveMovie() {
        if (this.data.Id > 0) {
            const data: any = {
                Id: this.data.Id,
                Title: this.data.Title,
                SeenAt: this.data.SeenAt,
                Url: this.data.Url
            };
            this.filmService.edit(data).then(() => {
                this.router.navigate(["/list"]);
            });
        } else {
            const data: any = {
                Id: undefined,
                Title: this.data.Title,
                SeenAt: this.data.SeenAt,
                Url: this.data.Url
            };
            this.filmService.add(data).then(() => {
                this.data.Url = undefined;
                this.data.Title = undefined;
                this.data.SeenAt = new Date();
                this.posterPath = undefined;
            });
        }
    }
}

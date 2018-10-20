import { FilmService } from "../film.service";

// import { log } from "util";
// import { Film, } from "../film.model";
import { TMDBMovie, TMDBService } from "../tmdb.service";
import { Component } from "@angular/core";
// import { FormControl } from "@angular/forms";

@Component({
    selector: "lsn-edit-page",
    templateUrl: "./edit-page.component.html",
    styleUrls: ["./edit-page.component.scss"],
    providers: [TMDBService, FilmService]
})
export class EditPageComponent {
    public movie: TMDBMovie;
    public posterPath: string;
    public data: any = {
        Id: undefined,
        Title: undefined,
        SeenAt: new Date()
    };
    constructor(
        private tmdb: TMDBService,
        private filmService: FilmService) {
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
        this.filmService.add(this.data).then(() => {
            this.data.Url = undefined;
            this.data.Title = undefined;
            this.data.SeenAt = new Date();
            this.posterPath = undefined;
        });
    }
}

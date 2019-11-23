import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../environments/environment";


export class TMDBMovie {
    public account_states: any;

    public adult: boolean;

    public alternative_titles: any;

    public backdrop_path: string;

    public belongs_to_collection: any;

    public budget: number;

    public changes: any;

    public credits: any;

    public genres: any;

    public homepage: string;

    public id: number;

    public images: any;

    public imdb_id: string;

    public keywords: any;

    public lists: any;

    public original_language: string;

    public original_title: string;

    public overview: string;

    public popularity: number;

    public poster_path: string;

    public production_companies: any;

    public production_countries: any;

    public release_date?: Date;

    public release_dates: any;

    public releases: any;

    public revenue: number;

    public reviews: any;

    public runtime?: number;

    public similar: any;

    public recommendations: any;

    public spoken_languages: any;

    public status: string;

    public tagline: string;

    public title: string;

    public translations: any;

    public video: boolean;

    public videos: any;

    public vote_average: number;

    public vote_count: number;
}

@Injectable()
export class TMDBService {
    public get url(): string {
        return "https://api.themoviedb.org/3/";
    }

    constructor(
        private http: HttpClient
    ) {
    }
    public getMovie(tmdbId: string): Observable<TMDBMovie> {
        console.log(`${this.url}movie/${tmdbId}?api_key=${environment.tmdbApiKey}`);
        return this.http.get(`${this.url}movie/${tmdbId}?api_key=${environment.tmdbApiKey}`)
            .pipe(
                map((response: any) => {
                    console.log("response 1", response);
                    return response;
                })
            );
    }
    public getMovieByImdbId(imdbId: string): Observable<TMDBMovie> {
        console.log(`${this.url}find/${imdbId}?api_key=${environment.tmdbApiKey}&external_source=imdb_id`)
        return this.http.get(`${this.url}find/${imdbId}?api_key=${environment.tmdbApiKey}&external_source=imdb_id`)
            .pipe(
                tap((response: { movie_results: any[] }) => console.log(response.movie_results[0])),
                map((response: { movie_results: any[] }) => response.movie_results[0])
            );
    }
    public searchMovie(title: string): Observable<any> {
        return this.http.get(`
        ${this.url}search/movie?api_key=${environment.tmdbApiKey}&query=${title}&language=en-US&page=1&include_adult=true`)
            .pipe(
                map((response: any) => {
                    console.log("response", response);
                    return response.results;
                })
            );
    }
    public getPoster(imageSize: string, imageFileName: string): Observable<any> {
        return this.http.get(this.getPosterPath(imageSize, imageFileName))
            .pipe(
                map((response: any) => response)
            );
    }
    public getPosterPath(imageSize: string, imageFileName: string): string {
        return `http://image.tmdb.org/t/p/${imageSize}/${imageFileName}`;
    }
}

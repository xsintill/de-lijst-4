import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { ITMDBMovie } from './tmdb-movie.type';

@Injectable()
export class TMDBService {
    public get url(): string {
        return 'https://api.themoviedb.org/3/';
    }

    constructor(
        private http: HttpClient
    ) {
    }
    public getMovie(tmdbId: string): Observable<ITMDBMovie> {
        console.log(`${this.url}movie/${tmdbId}?api_key=${environment.tmdbApiKey}`);
        return this.http.get(`${this.url}movie/${tmdbId}?api_key=${environment.tmdbApiKey}`)
            .pipe(
                map((response: any) => {
                    return response;
                })
            );
    }
    public getMovieByImdbId(imdbId: string): Observable<ITMDBMovie> {
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
                    console.log('response', response);
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

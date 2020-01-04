import { IFilmDBAnalytics } from './film-db-analytics.type';
import { IFilmProxy } from './film-proxy.type';
import { Genres } from './genres.enumeration';

export class FilmProxy implements IFilmProxy, IFilmDBAnalytics {
    public Id: number;
    public Title: string;
    public Url: string;
    public SeenAt: Date;
    public Genres: Genres;
    public Rating: number;
    public Image: ArrayBuffer;
    public ImageId: number;
    public ImageUrl: string;

    public MoviesSeenCount: number;
    public MoviesSeenNotInDBCount: number;
    public MoviesSeenInDBSinceCrashCount: number;
    public MoviesInDBCount: number;

    constructor() {
        this.Id = 0;
        this.SeenAt = new Date();
        this.Rating = 7;
    }
}

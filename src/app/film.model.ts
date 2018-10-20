
import { Genres } from "./genres.enumeration";

export interface IEntity {
        Id: number;
    }
    export interface IFilm extends IEntity {
        Title: string;
        Url?: string;
        SeenAt: Date;
        Genres?: Genres;
    }

    export class Film implements IFilm {
        public Id: number;
        public Title: string;
        public Url: string;
        public SeenAt: Date;
        public Genres: Genres;

        constructor() {
            this.Id = 0;
            this.SeenAt = new Date();

        }
    }

    export interface IFilmProxy extends IFilm, IEntity {
        Rating?: number;
        Image?: ArrayBuffer;
        ImageId?: number;
    }

    export interface IFilmDBAnalytics {
        MoviesSeenCount: number;
        MoviesSeenNotInDBCount: number;
        MoviesSeenInDBSinceCrashCount: number;
        MoviesInDBCount: number;
    }


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

    //  class FilmPagedProxy implements IFilmProxy {
    //     public Id: number;
    //     public Title: string;
    //     public Url: string;
    //     public SeenAt: Date;
    //     public Genres: Genres;
    //     public Rating: number;
    //     public Image: ArrayBuffer;
    //     public ImageId: number;

    //     constructor() {
    //         this.Id = 0;
    //         this.SeenAt = new Date();
    //         this.Rating = 7;
    //     }
    // }


import { IFilm } from './film.type';
import { Genres } from './genres.enumeration';

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

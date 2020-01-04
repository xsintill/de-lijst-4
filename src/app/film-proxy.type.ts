import { IEntity } from './entity.type';
import { IFilm } from './film.type';

export interface IFilmProxy extends IFilm, IEntity {
    Rating?: number;
    Image?: ArrayBuffer;
    ImageId?: number;
}
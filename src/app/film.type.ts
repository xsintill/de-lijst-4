import { IEntity } from './entity.type';
import { Genres } from './genres.enumeration';

export interface IFilm extends IEntity {
  Title: string;
  Url?: string;
  SeenAt: Date;
  Genres?: Genres;
}

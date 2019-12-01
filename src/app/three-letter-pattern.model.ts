import { IEntity } from './film.model';

export interface IThreeLetterPattern extends IEntity {
    LetterPattern: string;

    Occurrences: number;

    CreateTimeStamp: Date;
}

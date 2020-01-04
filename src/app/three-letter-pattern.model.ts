import { IEntity } from './entity.type';

export interface IThreeLetterPattern extends IEntity {
    LetterPattern: string;
    Occurrences: number;
    CreateTimeStamp: Date;
}
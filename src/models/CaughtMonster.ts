import {Table, Column, Model, PrimaryKey, DataType, AutoIncrement, ForeignKey, BelongsTo} from 'sequelize-typescript';
import { Trainer } from './Trainer';

@Table
export class CaughtMonster extends Model<CaughtMonster> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number

    @ForeignKey(() => Trainer)
    @Column
    trainerId: number;

    @BelongsTo(() => Trainer)
    trainer: Trainer;

    @Column
    pokemonId: number;

    @Column(DataType.BIGINT)
    exp: number;

    @Column
    dateCaught: Date;
}





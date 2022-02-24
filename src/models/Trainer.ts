import {Table, Column, Model, PrimaryKey, DataType, AutoIncrement, Default, HasMany, Index, Unique} from 'sequelize-typescript';
import { CaughtMonster } from './CaughtMonster';

@Table
export class Trainer extends Model<Trainer> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number

    @Index('idx-trainer')
    @Unique
    @Column
    userId: string;

    @Index('idx-trainer')
    @Unique
    @Column
    guildId: string;

    @Column(DataType.BIGINT)
    exp: number;

    @Default(0)
    @Column(DataType.BIGINT)
    pokeballs: number;

    @Default(0)
    @Column(DataType.BIGINT)
    masterballs: number;

    @Default(0)
    @Column(DataType.BIGINT)
    greatballs: number;

    @Default(0)
    @Column(DataType.BIGINT)
    ultraballs: number;

    @Default(0)
    @Column(DataType.BIGINT)
    netballs: number;

    @Default(0)
    @Column(DataType.BIGINT)
    diveballs: number;

    @Default(0)
    @Column(DataType.BIGINT)
    heavyballs: number;

    @HasMany(() => CaughtMonster)
    pokidex: CaughtMonster[];
}




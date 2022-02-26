import {
    Table,
    Column,
    Model,
    PrimaryKey,
    DataType,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
    Index, Unique
} from 'sequelize-typescript';

@Table
export class BotState extends Model<BotState> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number

    @Index('idx-bot-state')
    @Unique
    @Column
    guildId: string;

    @Column
    currentPokemon?: number;

    @Column
    channelName?: string

    @Column
    webhookId?: string
}





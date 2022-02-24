import {BotState} from "./models/BotState";

export async function getBotForGuild(guildId: string): Promise<BotState> {
    const [botState, created] = await BotState.findOrCreate({where: {guildId}, defaults: {guildId}})
    return botState;
}

export const randomInt = (min: number, max: number):number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

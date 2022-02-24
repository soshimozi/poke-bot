import {BotState} from "./models/BotState";

export async function getBotForGuild(guildId: string): Promise<BotState> {
    const [botState, created] = await BotState.findOrCreate({where: {guildId}, defaults: {guildId}})
    return botState;
}

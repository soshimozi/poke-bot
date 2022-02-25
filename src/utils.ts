import {BotState} from "./models/BotState";
import Canvas from "canvas";

export async function getBotForGuild(guildId: string): Promise<BotState> {
    const [botState, created] = await BotState.findOrCreate({where: {guildId}, defaults: {guildId}})
    return botState;
}

export const randomInt = (min: number, max: number):number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Gets variables and types
 * @param {object} canvas The canvas
 * @param {object} text The text
 * @param {object} defaultFontSize The default font pixel size
 * @param {object} width The max width of the text
 * @param {object} font The text font
 * @returns The variable formatted
 */
export function applyText(canvas:Canvas.Canvas, text:string, defaultFontSize:number, width:number, font:string){

    const ctx = canvas.getContext("2d");
    do {
        ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
    } while (ctx.measureText(text).width > width);
    return ctx.font;
}

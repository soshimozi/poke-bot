import {Client, Message, MessageAttachment, MessageEmbed} from "discord.js";
import {RankCard} from 'discord-canvas';
import {Trainer} from "../models/Trainer";
const canvacord = require("canvacord");
const Canvas = require("canvas");

let count = 0

export default (client:Client) : void => {
    client.on("messageCreate", async (message: Message) => {

        console.log('got a message!')

        // Ignore partial messages
        if(message.partial) return

        if(message.author.bot) return
        if(message.author.id === client.user?.id) return

        // don't count DMs
        if(!message.guild) return

        console.log(`${client.user?.username} sent us a message:  ${message.content}`)

        if(!message.content.startsWith(process.env.PREFIX)) {
            return await checkForRandomEncounters(client, message)
        }

        let canvas = Canvas.createCanvas(1080, 400),
            ctx = canvas.getContext("2d");

        const radiusCorner = "10"

        // Background
        ctx.beginPath();
        ctx.moveTo(0 + Number(radiusCorner), 0);
        ctx.lineTo(0 + 1080 - Number(radiusCorner), 0);
        ctx.quadraticCurveTo(0 + 1080, 0, 0 + 1080, 0 + Number(radiusCorner));
        ctx.lineTo(0 + 1080, 0 + 400 - Number(radiusCorner));
        ctx.quadraticCurveTo(
            0 + 1080,
            0 + 400,
            0 + 1080 - Number(radiusCorner),
            0 + 400
        );
        ctx.lineTo(0 + Number(radiusCorner), 0 + 400);
        ctx.quadraticCurveTo(0, 0 + 400, 0, 0 + 400 - Number(radiusCorner));
        ctx.lineTo(0, 0 + Number(radiusCorner));
        ctx.quadraticCurveTo(0, 0, 0 + Number(radiusCorner), 0);
        ctx.closePath();
        ctx.clip();
        if(count > 0)
            ctx.fillStyle = "Blue";
        else
            ctx.fillStyle = "Yellow";
        ctx.fillRect(0, 0, 1080, 400);

        const attachment = new MessageAttachment(canvas.toBuffer(), "rank-card.png");
        const embed = new MessageEmbed()
            .setTitle("Rank Card Example")
            .setImage("attachment://rank-card.png")

        count++

        await message.channel.send({embeds: [embed], files:[attachment]})
    });
}

async function checkForRandomEncounters(client:Client, message:Message): Promise<void> {

}

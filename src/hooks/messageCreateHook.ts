import {Client, Message, MessageAttachment, MessageEmbed} from "discord.js";
import {RankCard} from 'discord-canvas';
const canvacord = require("canvacord");

export default (client:Client) : void => {
    client.on("messageCreate", async (message: Message) => {

        console.log('got a message!')

        // Ignore partial messages
        if(message.partial) return;

        if(message.author.bot) return;
        if(message.author.id === client.user?.id) return;

        // don't count DMs
        if(!message.guild) return;

        console.log(`${client.user?.username} sent us a message:  ${message.content}`);

        let avatar = await canvacord.Canvas.circle(message.author.displayAvatarURL({ dynamic: false, format: 'png' }));

        const image = await new RankCard()
            //.setAvatar(message.author.avatarURL({format: "png" }))
            //.setAvatar(message.author.displayAvatarURL({dynamic: false, format: "png" }))
            .setAvatar(avatar)
            .setColor("background", "#296BC2") // BACKGROUND COLOR
            .setColor("needed-xp", "#ffffff")
            .setColor("background-bar", "#ffffff")
            .setColor("bar", "#05CEF7")
            .setColor("level", "#ffffff") // LEVEL COLOR
            .setColor("level-box", "#05CEF7") // LEVEL COLOR
            .setAddon("reputation", false) // Reputation box
            .setBadge(1, null)
            .setBadge(2, "diamond")
            //.setBadge(3, "silver")
            //.setBadge(4, "bronze")
            .setXP("current", 500) // XP POINTS IN THIS RANK
            .setXP("needed", 1500) // XP POINTS NECESSARY FOR THE NEXT RANK
            .setRadius(50)
            .setUsername(message.author.username)
            .toAttachment();

        const attachment = new MessageAttachment(image.toBuffer(), "rank-card.png");

        const exampleEmbed = new MessageEmbed()
            .setTitle("Rank Card Example")
            .setImage("attachment://rank-card.png")

        await message.channel.send({embeds: [exampleEmbed], files:[attachment]})
    });
}

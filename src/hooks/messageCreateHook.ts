import {Client, Message} from "discord.js";

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
    });
}

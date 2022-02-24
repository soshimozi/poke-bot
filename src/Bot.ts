require('dotenv').config(); // Recommended way of loading dotenv

import {Client, Message, PartialMessage} from "discord.js"
import readyHook from "./hooks/ready-hook";
import messageHook from './hooks/message-hook'

//import interactionCreate from "./interactionCreate";

console.log("Bot is starting...")

const token = process.env.DISCORDBOTKEY;

console.log('token: ', token)


const client = new Client(
    {
        intents:
            [   "GUILD_MESSAGES",
                "GUILD_MESSAGE_REACTIONS",
                "GUILDS"
            ]
    });

// register hooks
//readyHook(client)
//messageHook(client)

client.on("ready", async () => {
    if (!client.user) {
        return;
    }
    console.log(`${client.user.username} is online ready for commands.`);
});

client.on("messageUpdate", async(oldMessage, message) => {
    console.log(`messageUpdate => oldMessage: '${oldMessage}', message: '${message}'`)
})

client.on("messageCreate", async (message) => {

    console.log('got a message!')

    // Ignore partial messages
    if(message.partial) return;

    if(message.author.bot) return;
    if(message.author.id === client.user?.id) return;

    // don't count DMs
    if(!message.guild) return;

    console.log(`${client.user?.username} sent us a message:  ${message.content}`);
})

client.on("messageReactionAdd", async(reaction, user) => {
    console.log("got a reaction!")
})

client.login(token).then( (res) => {
    console.log('Bot successfully logged in.')
})

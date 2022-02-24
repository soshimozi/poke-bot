require('dotenv').config(); // Recommended way of loading dotenv

import {Client} from "discord.js"

import readyHook from "./hooks/readyHook";
import messageCreateHook from './hooks/messageCreateHook'
import messageReactionAddHook from './hooks/messaeReactionAddHook'

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
readyHook(client)
messageCreateHook(client)
messageReactionAddHook(client)

client.login(token).then( (res) => {
    console.log('Bot successfully logged in.')
})

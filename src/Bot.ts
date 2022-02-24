import {Sequelize} from "sequelize-typescript";

require('dotenv').config(); // Recommended way of loading dotenv

import {Client} from "discord.js"

import readyHook from "./hooks/readyHook";
import messageCreateHook from './hooks/messageCreateHook'
import messageReactionAddHook from './hooks/messageReactionAddHook'

const token = process.env.DISCORDBOTKEY;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DATABASENAME,
    models: [__dirname + '/models']
})


sequelize.sync({force: false}).then( () => {
    console.info('Database initialized');
}).catch( (err) => {
    console.error(`Failed to initialize database: ${err}`)
    throw err
})

const client = new Client(
    {
        intents:
            [   "GUILD_MESSAGES",
                "GUILD_MESSAGE_REACTIONS",
                "GUILDS"
            ]
    })

// register hooks
readyHook(client)
messageCreateHook(client)
messageReactionAddHook(client)

client.login(token).then( (res) => {
    console.log('Bot successfully logged in.')
})

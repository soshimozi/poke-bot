import {Client, Message, MessageAttachment, MessageEmbed, WebhookClient} from "discord.js";
import {RankCard} from 'discord-canvas';
import {Trainer} from "../models/Trainer";
import PokemonCard from "../cards/pokemon";
import {getBotForGuild} from "../utils";

import moment from "moment";
import {PokemonRepository} from "../PokemonRepository";

const canvacord = require("canvacord");

let count = 0

export default (client:Client) : void => {
    client.on("messageCreate", async (message: Message) => {

        if(!shouldHandleMessage(client, message)) return;

        console.log('got a message!')

        if(!message.content.startsWith(process.env.PREFIX)) {
            return await checkForRandomEncounters(client, message)
        }

        console.log(`${client.user?.username} sent us a command:  ${message.content}`)

    });
}

function shouldHandleMessage(client:Client, message:Message) : boolean {
    // Ignore partial messages
    if(message.partial) return false

    if(message.author.bot) return false
    if(message.author.id === client.user?.id) return false

    // don't count DMs
    if(!message.guild) return false

    return true
}

async function checkForRandomEncounters(client:Client, message:Message): Promise<void> {

    let botState = await getBotForGuild(message.guild.id)

    if(moment().diff(moment(botState.nextEncounter || new Date())) < 0) return

    let timeout = Math.floor(Math.random() * (30 - 10 + 1) + 10)

    botState.nextEncounter = moment(botState.nextEncounter || new Date()).add(timeout, 'seconds').toDate()
    botState.currentPokemon = 12323

    await botState.save()

    const pokeList = await PokemonRepository.getPokemonList(0, 1126)

    const index = Math.floor(Math.random() * (500 - 0 + 1) + 500)

    console.log('index: ', index)
    const pokeListItem = pokeList.results[index]
    console.log(pokeListItem)

    const pokemon = await PokemonRepository.getPokemonInfo(pokeListItem.name)

    const avatar = await canvacord.Canvas.circle(pokemon.sprites.front_default);

    const pc = await new PokemonCard()
        .setColorBackground(count > 0 ? "Blue" : "Yellow")
        .setPokemonAvatar(avatar)
        .setOpacityAvatar("1.0")
        .toAttachment()

    const attachment = new MessageAttachment(await pc.toBuffer(), "rank-card.png");
    const embed = new MessageEmbed()
        .setTitle("Rank Card Example")
        .setImage("attachment://rank-card.png")

    count++

    await message.channel.send({embeds: [embed], files:[attachment]})
}

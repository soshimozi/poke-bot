import {Client, Message, MessageAttachment, MessageEmbed, WebhookClient} from "discord.js";
import {RankCard} from 'discord-canvas';
import {Trainer} from "../models/Trainer";
import PokemonCard from "../cards/pokemon";
import {getBotForGuild, randomInt} from "../utils";

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

    const pokeList = await PokemonRepository.getPokemonList(0, 2000)

    const index = randomInt(0, pokeList.results.length - 1)

    let timeout = Math.floor(Math.random() * (30 - 10 + 1) + 10)
    botState.nextEncounter = moment(botState.nextEncounter || new Date()).add(timeout, 'seconds').toDate()

    botState.currentPokemon = index
    await botState.save()

    const pokeListItem = pokeList.results[index]
    const pokemon = await PokemonRepository.getPokemonInfo(pokeListItem.name)
    const avatar = await canvacord.Canvas.circle(pokemon.sprites.front_default);

    console.log('pokemon: ', pokeListItem?.name)
    console.log('index: ', index)

    const pc = new PokemonCard()
        .setColorBackground("#ffffff")
        .setBorderColor("#2f2f2f")
        .setBorderWidth("7")
        .setPokemonAvatar(avatar)
        .setOpacityAvatar("0.4");

    pokemon.types.forEach((pt, index) => {
        pc.addType(pt.type.name);
    })

    const cardAttachment = await pc.toAttachment()

    const attachment = new MessageAttachment(await cardAttachment.toBuffer(), "pokemon-card.png");
    const embed = new MessageEmbed()
        .setTitle("A Pokemon Appears!")
        .setImage("attachment://pokemon-card.png")

    count++

    await message.channel.send({embeds: [embed], files:[attachment]})
}

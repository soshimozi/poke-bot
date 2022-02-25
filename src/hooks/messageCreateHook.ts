import {Client, Message, MessageAttachment, MessageEmbed} from "discord.js";
import PokemonCard from "../cards/pokemon";
import {getBotForGuild, randomInt} from "../utils";

import moment from "moment";
import {PokemonRepository} from "../PokemonRepository";
import {capitalize} from "sequelize-typescript/dist/shared/string";

const canvacord = require("canvacord");

export default (client:Client) : void => {
    client.on("messageCreate", async (message: Message) => {

        if(message.webhookId === "") {
            return await checkForRandomEncounters(client, message)
        }

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

async function getRandomPokemon() {
    const pokeList = await PokemonRepository.getPokemonList(0, 898)

    const index = randomInt(0, pokeList.results.length - 1)
    const pokeListItem = pokeList.results[index]
    const pokemon = await PokemonRepository.getPokemonInfo(pokeListItem.name)
    return pokemon;
}

function isVowel(str: string) {
    const vowels = ['a', 'e', 'i', 'o', 'u']

    for(let vi in vowels) {
        if(str === vowels[vi]) return true
    }

    return false
}

async function checkForRandomEncounters(client:Client, message:Message): Promise<void> {

    let botState = await getBotForGuild(message.guild.id)

    if(moment().diff(moment(botState.nextEncounter || new Date())) < 0) return

    // random chance based on trainers current area
    // for now it's a base 30%
    if(randomInt(0, 100) > 30) return

    // let's get a pokemon!
    const pokemon = await getRandomPokemon();

    let timeout = Math.floor(Math.random() * (30 - 10 + 1) + 10)
    botState.nextEncounter = moment(botState.nextEncounter || new Date()).add(timeout, 'seconds').toDate()
    botState.currentPokemon = pokemon.id
    await botState.save()

    const pokemonSpecies = await PokemonRepository.getPokemonSpecies(pokemon.species.name)
    let flavor_text_entries = pokemonSpecies.flavor_text_entries.filter((ft) => { return ft.language.name === "en" })

    let flavorText = flavor_text_entries[0].flavor_text.replace( /[\n\r]/g, ' ')
    flavorText = flavorText.replace(/[\f]/g, ' ')
    console.debug(flavor_text_entries[0])
    console.debug(flavorText)

    const types = pokemon.types.map((pt, index) => { return capitalize(pt.type.name) })

    const embed = new MessageEmbed()
        .setTitle(`${isVowel(pokemon.name[0]) ? 'An' : 'A'} ${capitalize(pokemon.name)} Appears!`)
        .setDescription(`${isVowel(pokemon.name[0]) ? 'An' : 'A'} ${capitalize(pokemon.name)} has appeared!  You can use the **!catch** command to catch it.`)
        .setTimestamp(new Date())
        .addField('Description', flavorText, false)
        .addField("Difficulty", pokemonSpecies.capture_rate < 3 ? "Extremely Hard" : pokemonSpecies.capture_rate < 10 ? "Very Hard" : pokemonSpecies.capture_rate < 30 ? "Hard" : pokemonSpecies.capture_rate < 50 ? "Medium" : pokemonSpecies.capture_rate < 80 ? "Easy" : "Very Easy", true)
        .addField('Experience Points', `${pokemon.base_experience}`, true)
        .addField('Types', types.join(' '), false)
        .addField("Mythical", pokemonSpecies.is_mythical ? "Yes" : "No", true)
        .addField("Legendary", pokemonSpecies.is_legendary ? "Yes" : "No", true)
        .addField("Baby", pokemonSpecies.is_baby ? "Yes" : "No", true)
        .setImage(pokemon.sprites.front_shiny)
        .setFooter( { text: 'Gotta catchem all!' })

    await message.channel.send({embeds: [embed], files:[]})
}

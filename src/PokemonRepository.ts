const Pokedex = require('pokedex-promise-v2');

const P = new Pokedex();

/*

{"count":1118,"next":"https://pokeapi.co/api/v2/pokemon?offset=181&limit=181","previous":null,"results":[{"name":"bulbasaur","url":"https://pokeapi.co/api/v2/pokemon/1/"}
*/

export interface PokemonSpeciesEntry {
    name: string
    url: string
}

export interface PokemonAbility {
    name: string
    url: string
}

export interface PokemonAbilities {
    ability : PokemonAbility
}

export interface  PokemonTypeRecord {
    name: string
    url: string
}

export interface PokemonType {
    slot: number;
    type: PokemonTypeRecord;
}

export interface IPokemonSprites {
    front_default: string;
    front_shiny: string;
    front_female: string;
    from_shiny_female: string;
    back_default: string;
    back_shiny: string;
    back_female: string;
    back_shiny_female: string;
}

export interface IPokemonInfo {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    weight: number;
    sprites:IPokemonSprites;
    abilities: PokemonAbilities[];
    types: PokemonType[];
    species: PokemonSpeciesEntry
}

export interface SpeciesColor {
    name: string
    url: string
}

export interface LanguageEntry {
    name: string
    url: string
}

export interface FlavorTextEntry {
    flavor_text: string
    language: LanguageEntry
}

export interface IPokemonSpecies {
    base_happiness: number
    capture_rate: number
    color: SpeciesColor
    flavor_text_entries: FlavorTextEntry[]
    id: number
    name: string
    is_baby: boolean
    is_legendary: boolean
    is_mythical: boolean
}

export interface IPokemonListEntry {
    name: string;
    url: string;
}

export interface IPokemonListResult {
    count:number;
    next: string;
    previous: string;
    results: IPokemonListEntry[];
}

export class PokemonRepository {

    static async getPokemonList(offset:number, limit: number) : Promise<IPokemonListResult> {
        var interval = {limit, offset};
        return await P.getPokemonsList(interval);
    }

    static async getPokemonInfo(name: string): Promise<IPokemonInfo> {

        const pokemon = await P.getPokemonByName(name)
        return pokemon
    }

    static async getPokemonSpecies(name: string): Promise<IPokemonSpecies> {
        const species = await P.getPokemonSpeciesByName(name)
        return species
    }
}

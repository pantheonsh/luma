let pokemons = ["bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree", "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata", "raticate", "spearow", "fearow", "ekans", "arbok", "pikachu", "raichu", "sandshrew", "sandslash", "nidoranf", "nidorina", "nidoqueen", "nidoranm", "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales", "jigglypuff", "wigglytuff", "zubat", "golbat", "oddish", "gloom", "vileplume", "paras", "parasect", "venonat", "venomoth", "diglett", "dugtrio", "meowth", "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe", "arcanine", "poliwag", "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop", "machoke", "machamp", "bellsprout", "weepinbell", "victreebel", "tentacool", "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash", "slowpoke", "slowbro", "magnemite", "magneton", "farfetch’d", "doduo", "dodrio", "seel", "dewgong", "grimer", "muk", "shellder", "cloyster", "gastly", "haunter", "gengar", "onix", "drowzee", "hypno", "krabby", "kingler", "voltorb", "electrode", "exeggcute", "exeggutor", "cubone", "marowak", "hitmonlee", "hitmonchan", "lickitung", "koffing", "weezing", "rhyhorn", "rhydon", "chansey", "tangela", "kangaskhan", "horsea", "seadra", "goldeen", "seaking", "staryu", "starmie", "mr. mime", "scyther", "jynx", "electabuzz", "magmar", "pinsir", "tauros", "magikarp", "gyarados", "lapras", "ditto", "eevee", "vaporeon", "jolteon", "flareon", "porygon", "omanyte", "omastar", "kabuto", "kabutops", "aerodactyl", "snorlax", "articuno", "zapdos", "moltres", "dratini", "dragonair", "dragonite", "mewtwo", "mew"];

const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");

class FusionCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        args = args.join(" ").replace("; ", ";").split(";");

        let pokemon_1 = args[0];
        let pokemon_2 = args[1];

        if (!pokemon_1 || !pokemon_2) {
            super.throwUsageError(msg, this, "Você não especificou dois Pokémons de primeira geração.");
            return;
        }

        pokemon_1 = pokemon_1.toLowerCase();
        pokemon_2 = pokemon_2.toLowerCase();

        let i1 = pokemons.indexOf(pokemon_1) + 1;
        let i2 = pokemons.indexOf(pokemon_2) + 1;

        if (i1 === 0 || i2 === 0) {
            super.throwUsageError(msg, this, `Pelo menos um dos Pokémons especificados não existem. (Informação útil: caso queira fundir um Nidoran, use NidoranF para Nidoran♀ e NidoranM para Nidoran♂). Aliás, só suporto Pokémons da primeira geração. Não use acentos. Nomes em inglês.`);
            return;
        }

        let imagem = "http://images.alexonsager.net/pokemon/fused/" + i1 + "/" + i1 + "." + i2 + ".png";

        let nome = [
            pokemon_1.slice(0, Math.round(pokemon_1.length / 2)),
            pokemon_2.slice(0, Math.round(pokemon_2.length / 2))
        ].join("");

        let embed = new Discord.RichEmbed();
        embed.setTitle(`Fusão realizada!`);

        embed.setColor(0x4DB6AC);

        embed.addField("\u200B", `Aqui está seu novo Pokemon, ${nome}:`);

        embed.setImage(imagem);

        msg.reply({
            embed
        });
    }

    getName() {
        return "fusão"
    }

    getCategory() {
        return "Diversão"
    }

    getDescription() {
        return "Faz a fusão de 2 Pokémons!"
    }

    getUsage() {
        return "fusão <pokemon 1>; <pokemon 2>"
    }

    getExample() {
        return "fusão Pikachu; Charmander"
    }

    getAliases() {
        return ["fusion"]
    }

    getPermissions() {
        return {
            "bot": ["EMBED_LINKS", "ATTACH_FILES"],
            "user": [],
            "owner": false
        }
    }

    // retorna uma Array contendo os tipos de canais
    // onde o comando pode ser executado.
    getSupportedTextChannels() {
        return [
            "dm", // pv
            "group", // pv em grupo
            "text", // canal de texto numa guild
        ]
    }
}

module.exports = FusionCommand;
const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");

let now;
let start = new Date("2012-05-31").getTime();

let distanceFirstPart;
let distanceRest;

class AndromedaCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {

        let km = calcKM();

        let embed = new Discord.RichEmbed();

        embed.setColor(0x546E7A);
        embed.setTitle(`☄ Galáxia de Andrômeda`);
        embed.setDescription([
            `Andromeda está a **${km}km** (± 1.04 × 10¹⁸) longe de nós.`,
            `Estima-se que a galáxia Andromeda *(aka Messier 31)* esteja em torno de 2.5 milhões de anos-luz longe de nós aqui na Terra.`,
            `CMD_ANDROMEDA_BULLSHIT1": "Por causa de seu tamanho e proximidade à nossa galáxia, Andromeda pode ser observada com o olho nu numa noite estrelada.`,
            `Podemos afirmar que Andromeda se aproxima de nossa galáxia em cerca de 110 quilômetros por segundo.`,
            `O que significa que em torno de 4-6 bilhões de anos, Andromeda e Via Láctea se fundirão.`
        ]);

        msg.reply({
            embed
        });
    }

    getName() {
        return "distânciaandromeda"
    }

    getCategory() {
        return; // misc
    }

    getDescription() {
        return "Mostra o quão distante Andrômeda está de nós!"
    }

    getUsage() {
        return "distânciaandromeda"
    }

    getExample() {
        return "distânciaandromeda"
    }

    getAliases() {
        return ["distanciaandromeda", "distânciaandrômeda", "distânciaandrômeda"]
    }

    getPermissions() {
        return {
            "bot": [],
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

module.exports = AndromedaCommand;

function calcKM() {
    now = new Date().getTime();

    distanceFirstPart = 2403025540035522; //too large, whoops
    distanceRest = 10000;

    var elapsed = Math.round((now - start) / 1000) * 110;

    distanceFirstPart -= Math.floor(elapsed / 10000);
    distanceRest -= Math.round(((elapsed / 10000) % 1) * 10000);

    return distanceFirstPart + pad(distanceRest, 4);
}

function pad(num, size) { //add leading zero
    var s = "000000" + num;
    return s.substr(s.length - size);
}
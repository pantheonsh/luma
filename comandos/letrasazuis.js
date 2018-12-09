const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");

class LetrasAzuisCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let texto = args.join(" ").toLowerCase().split("");
        let chars = "abcdefghijklmnopqrstuvwxyz";
        let nText = "";
        texto.forEach(function (element) {
            if (chars.includes(element)) {
                // está na lista de emojis de letras
                nText = nText + ":regional_indicator_" + element + ":";
            } else {
                // não está
                nText = nText + element;
            }
        });

        if (nText.length < 2000) {
            msg.channel.send(nText);
        } else {
            super.throwCommandError(msg, this, `O limite máximo de 2000 caracteres imposto pelo Discord foi excedido.`);
        }
    }

    getName() {
        return "letrasgrandes"
    }

    getCategory() {
        return; // misc
    }

    getDescription() {
        return "Converte o texto para letras azuis."
    }

    getUsage() {
        return "letrasgrandes <texto>"
    }

    getExample() {
        return "letrasgrandes azul"
    }

    getAliases() {
        return ["letrasazuis"]
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

module.exports = LetrasAzuisCommand;
const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const bigIntg = require("big-integer");

class AnagramaCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {

        let palavra = args.join(" ");

        if (palavra.length < 1) {
            super.throwUsageError(msg, this, `Para eu contar o número de anagramas, você deve especificar a palavra. Desculpe!`);
            return;
        }

        var result = bigIntg(palavra.length);
        for (var i = 1; i < palavra.length; i++) {
            result = result.multiply(i);
        }

        let embed = new Discord.RichEmbed();

        embed.setColor(0x42f4a7);

        embed.setTitle(`🖨 Contagem de anagramas`);

        embed.setDescription(`A frase \`${palavra}\` possui ${result.toString()} anagramas! o.O`);

        msg.reply({
            embed
        });
    }

    getName() {
        return "anagrama"
    }

    getCategory() {
        return "Diversão"
    }

    getDescription() {
        return "Conta quantos anagramas (combinações possíveis de letras) uma frase pode ter!"
    }

    getUsage() {
        return "anagrama <frase>"
    }

    getExample() {
        return "anagrama kk eae men"
    }

    getAliases() {
        return ["anagramas", "contaranagrama", "contaranagramas"]
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

module.exports = AnagramaCommand;
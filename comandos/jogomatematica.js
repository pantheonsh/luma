const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const translate = require('google-translate-api');

var operadoresFaceis = ["+", "-"]
var operadoresDificeis = ["*", "/", "+", "-"]
var opostos = {
    "+": "-",
    "-": "+",
    "*": "/",
    "/": "*"
}

var res = 0;
var exp = "";

var gerarNumero = function (min, max) {
    var n = Math.floor(Math.random() * (max - min + 1) + min);
    //if (Math.round(n / 2) !== n / 2) n = n + 1;
    return n;
}

var gerarExpressao = function (tamanho = 2, dificuldade = 3) {
    var resposta = 0;
    var exprString = gerarNumero(10, (10 * dificuldade)) + "";

    var dificil = dificuldade > 2;

    var o = dificil ? operadoresDificeis : operadoresFaceis;

    var tempo = 8;

    var usados = [];
    for (var i = 0; i < tamanho; i++) {
        var op = o[Math.floor(Math.random() * o.length)];
        var n = gerarNumero(10, (10 * dificuldade));

        while (usados.includes(n)) {
            n = gerarNumero(10, (10 * dificuldade));
        }

        usados.push(n);

        tempo = tempo + 4 + usados.length;

        exprString += " " + op + " " + n;
    }

    tempo = tempo * 2;

    resposta = eval(exprString);

    return {
        e: exprString,
        r: resposta,
        t: tempo
    }
}

let users = []

class JogoMatematicaCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let dificuldade = parseInt(args[0]);

        if (dificuldade < 1 || dificuldade > 5 || isNaN(dificuldade)) {
            super.throwUsageError(msg, this, "Dificuldade deve ser entre 1 e 5.");
            return;
        }

        if (users.includes(msg.author.id)) {
            super.throwCommandError(msg, this, "Termine o problema matemático anterior primeiro.");
            return;
        }

        users.push(msg.author.id);

        if (dificuldade === 1) dificuldade = 2;

        var expr = gerarExpressao(dificuldade * 2 + gerarNumero(1, 4), dificuldade);

        let embed = new Discord.RichEmbed();
        embed.setColor(0x3B88C3);
        embed.setTitle("Jogo da matemática");
        embed.setDescription([
            "🔢 Qual o resultado do problema a seguir?",
            "<:blank:425018054850904074> `" + expr.e.split("*").join("x").split("/").join("÷") + "`",
            "",
            "Você tem `" + expr.t + "` segundos para resolver. Boa sorte!"
        ]);

        msg.reply({
            embed
        });

        let filter = m => {
            return m.author.id === msg.author.id && !isNaN(m.content.replace(",", "."));
        }

        msg.channel.awaitMessages(filter, {
                max: 1,
                time: expr.t * 1000,
                errors: ["time"]
            })
            .then(msgs => {
                let m = msgs.first();

                if (Math.ceil(parseFloat(m.content)) == Math.ceil(expr.r)) {
                    embed.setColor(0x3B88C3);
                    embed.setDescription("🆗 Você acertou!");
                    msg.reply({
                        embed
                    });
                } else {
                    embed.setColor(0xB5182F);
                    embed.setDescription("⁉ Errou! A resposta era `" + Math.ceil(expr.r) + "`.");
                    msg.reply({
                        embed
                    });
                }

                users.splice(users.indexOf(msg.author.id), 1);
            })
            .catch(ex => {
                embed.setColor(0xB5182F);
                embed.setDescription("⁉ O tempo acabou! A resposta era `" + Math.ceil(expr.r) + "`.");
                msg.reply({
                    embed
                });
                users.splice(users.indexOf(msg.author.id), 1);
            })

    }

    getName() {
        return "jogomatematica"
    }

    getCategory() {
        return "Mini-games"
    }

    getDescription() {
        return "Gera um problema matemático para você resolver em um tempo determinado!"
    }

    getUsage() {
        return "jogomatematica <dificuldade 1-5>"
    }

    getExample() {
        return "jogomatematica 4"
    }

    getAliases() {
        return []
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

module.exports = JogoMatematicaCommand;
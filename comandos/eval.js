const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");

class EvalCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let codigo = args.join(" ");

        let resultado;

        try {
            resultado = eval(codigo);
        } catch (ex) {
            resultado = ex;
        }

        let embed = new Discord.RichEmbed();
        embed.setTitle("Resultados do eval");

        embed.setColor(0x4DB6AC);

        embed.addField("📥 Input", "```" + codigo + "```");
        embed.addField("🗃 Output", "```" + resultado + "```");

        msg.reply({
            embed
        });
    }

    getName() {
        return "eval"
    }

    getCategory() {
        return "Desenvolvimento"
    }

    getDescription() {
        return "Executa JavaScript dinamicamente!"
    }

    getUsage() {
        return "eval <codigo>"
    }

    getExample() {
        return "eval console.log(\"Olá.\")"
    }

    getAliases() {
        return ["js"]
    }

    getPermissions() {
        return {
            "bot": [],
            "user": [],
            "owner": true
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

module.exports = EvalCommand;
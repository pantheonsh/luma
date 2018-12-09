const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const math = require('mathjs');

class CalcCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let expr = (args.join(" "));
        let notation = false;

        if (expr.endsWith("-n")) {
            expr = expr.slice(0, expr.length - 2);
            notation = true;
        }
        if (expr.endsWith("--notação") || expr.endsWith("--notacao")) {
            expr = expr.slice(0, expr.length - 7);
            notation = true;
        }

        if (!expr) {
            super.throwUsageError(msg, this, "Nenhuma expressão especificada!");
            return;
        }

        console.log(expr)

        let embed = new Discord.RichEmbed();

        try {
            let r_raw = math.eval(expr);
            let r_formatted = math.format(r_raw, {
                notation: "fixed"
            });
            let r_formatted_notation = math.format(r_raw, {});

            embed.setTitle(`📠 Calculadora`);
            embed.addField(`📥 Expressão`, "`" + (expr.split("*").join("\*")) + "`");
            embed.addField(`📤 Resultado`, "`" + r_formatted + "`");
            if (r_formatted_notation != r_formatted)
                embed.addField("📒 Notação científica", "`" + r_formatted_notation + "`");
        } catch (ex) {
            embed.setTitle("⚠ Erro!");
            embed.addField("ᴜᴍ ᴇʀʀᴏ ᴏᴄᴏʀʀᴇᴜ ᴀᴏ ᴄᴏᴍᴘɪʟᴀʀ ᴀ ᴇxᴘʀᴇssãᴏ.", "```" + ex.message + "```");
        }

        msg.reply({
            embed
        });
    }

    getName() {
        return "calcular"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription() {
        return "Calcula uma expressão matemática. Se \"-n\" estiver presente, mostrarei o resultado em notação científica para números colossais."
    }

    getUsage() {
        return "calcular <expressão> -n"
    }

    getExample() {
        return "calcular 8 * 8"
    }

    getAliases() {
        return ["calc", "math"]
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

module.exports = CalcCommand;
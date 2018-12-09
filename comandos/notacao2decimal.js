const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const snfetch = require("snekfetch");
const scientificToDecimal = require("scientific-to-decimal");

class Notacao2DecimalCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler, Database){
        let expr = (args.join(" "));

        if(!expr) {
            super.throwUsageError(msg, this, "Nenhuma notação científica especificada!");
            return;
        }

        let embed = new Discord.RichEmbed();
        
        let r = scientificToDecimal(expr);

        if(!isNaN(r) && r !== "NaN") {
            embed.setTitle("📄 Notação científica -> Decimal");
            embed.addField("Resultado", "`" + r + "`");
        } else {
            embed.setTitle("⚠ Erro!");
            embed.addField("ᴜᴍ ᴇʀʀᴏ ᴏᴄᴏʀʀᴇᴜ ᴀᴏ ɪɴᴛᴇʀᴘʀᴇᴛᴀʀ ᴀ ᴇxᴘʀᴇssãᴏ.", "\u200B");
        }

        msg.reply({embed});
    }

    getName(){
        return "notaçãodecimal"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription(){
        return "Converte notação científica para decimal."
    }

    getUsage(){
        return "notaçãodecimal <expressão>"
    }

    getExample(){
        return "notaçãodecimal 1e+32"
    }

    getAliases(){
        return ["n2d", "ntd"]
    }

    getPermissions(){
        return {
            "bot": [],
            "user": [],
            "owner": false
        }
    }

    // retorna uma Array contendo os tipos de canais
    // onde o comando pode ser executado.
    getSupportedTextChannels(){
        return [
            "dm", // pv
            "group", // pv em grupo
            "text", // canal de texto numa guild
        ]
    }
}

module.exports = Notacao2DecimalCommand;
const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const snfetch = require("snekfetch");

class SimSimiCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler, Database){
        let texto = (args.join(" ")) || "oi";

        snfetch.get(`http://ghuntur.com/simsim.php?lc=&deviceId=${Date.now()}&bad=&txt=${encodeURIComponent(texto)}`)
            .then(r => {
                let texto = r.body.toString().replace("\n", "");

                if(texto.includes("Talk with random person")) texto = "*Não há uma resposta para isso.*";

                msg.reply(texto + " <:simsimi:448189729800978442>")
            });
    }

    getName(){
        return "simsimi"
    }

    getCategory() {
        return "Chatbots"
    }

    getDescription(){
        return "Converse com o Simsimi."
    }

    getUsage(){
        return "simsimi <frase>"
    }

    getExample(){
        return "simsimi bom dia"
    }

    getAliases(){
        return ["ss"]
    }

    getPermissions(){
        return {
            "bot": ["EMBED_LINKS"],
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

module.exports = SimSimiCommand;
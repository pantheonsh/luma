const Command = require("../sistemas/Command.js");
const Util = require("../sistemas/Util.js");
const Discord = require("discord.js");

class HttpCatCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler, Database){
     
        let codes = ["100","101","102","200","201","202","203","204","205","206","207","208","226","300","301","302","303","304","305","307","308","400","401","402","403","404","405","406","407","408","409","410","411","412","413","414","415","416","417","418","421","422","423","424","426","428","429","431","444","451","499","500","501","502","503","504","505","506","507","508","510","511","599"];
        let embed = new Discord.RichEmbed();

        let value = Util.randomItemFromArray(codes);

        embed.setTitle("🐱 HTTP Cat — " + value);

        embed.addField("\u200B", "https://http.cat/" + value + ".jpg");

        embed.setImage("https://http.cat/" + value + ".jpg");

        msg.channel.send({embed});
    }

    getName(){
        return "gato"
    }

    getCategory() {
        return; // misc
    }

    getDescription(){
        return "Mostra uma imagem aleatória de um gato do http.cat"
    }

    getUsage(){
        return "gato"
    }

    getExample(){
        return "gato"
    }

    getAliases(){
        return ["httpcat"]
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

module.exports = HttpCatCommand;
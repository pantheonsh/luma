const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");

const Strawberry = require("../sistemas/StrawberryAPI");

class StrawberryTestCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args){
        let codigo = args.join(" ");

        let resultado;

        let SBCtx = new Strawberry.Classes.StrawberryContext(client, msg, args);

        Strawberry.executeScript(codigo, SBCtx, function(err){
            let embed = new Discord.RichEmbed();
            embed.setTitle("ERRO!");
    
            embed.setColor(0xFF0000);
    
            embed.addField("🗃 Output", "```" + err + "```");
    
            msg.reply({embed});
        });
    }

    getName(){
        return "sbt"
    }

    getCategory() {
        return "Desenvolvimento"
    }

    getDescription(){
        return "Executa JavaScript dinâmicamente!"
    }

    getUsage(){
        return "sbt <codigo>"
    }

    getExample(){
        return "sbt console.log(\"Olá.\")"
    }

    getAliases(){
        return ["sbtjs"]
    }

    getPermissions(){
        return {
            "bot": [],
            "user": [],
            "owner": true
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

module.exports = StrawberryTestCommand;
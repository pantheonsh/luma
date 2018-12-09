const Command = require("../sistemas/Command.js");
const snfetch = require("snekfetch");

class NekoCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler, Database){
        var r = await snfetch.get("https://nekos.life/api/neko");

        msg.reply(r.body.neko);
    }

    getName(){
        return "neko"
    }

    getCategory() {
        return "Diversão"
    }

    getDescription(){
        return "Mostra uma catgirl!"
    }

    getUsage(){
        return "neko"
    }

    getExample(){
        return "neko"
    }

    getAliases(){
        return ["catgirl"]
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

module.exports = NekoCommand;
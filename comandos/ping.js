const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");

class PingCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        msg.reply(`${Math.floor(client.ping)}ms`);
    }

    getName() {
        return "ping"
    }

    getCategory() {
        return; // nada
    }

    getDescription() {
        return "Mostra meu ping!"
    }

    getUsage() {
        return "ping"
    }

    getExample() {
        return "ping"
    }

    getAliases() {
        return ["latência"]
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

module.exports = PingCommand;
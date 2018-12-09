const Command = require("../sistemas/Command.js");
const Variables = require("../sistemas/CommmandVariables");
const Discord = require("discord.js");

class AFKCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        if (!Variables.afk.has(msg.author.id)) {
            let motivo = args.join(" ");
            Variables.afk.set(msg.author.id, {
                time: Date.now(),
                reason: motivo
            });
            msg.reply("\n<:check:432530707068354610> **Marquei-te AFK!**\n<:blank:425018054850904074> Se alguém te mencionar, irei notificar.");
        }
    }

    getName() {
        return "afk"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription() {
        return "Marca você como AFK (Away From Keyboard, longe do teclado)"
    }

    getUsage() {
        return "afk"
    }

    getExample() {
        return "afk"
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

module.exports = AFKCommand;
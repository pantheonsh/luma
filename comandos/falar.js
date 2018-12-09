const Command = require("../sistemas/Command.js");
const Util = require("../sistemas/Util");

class SayCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let texto = args.join(" ");

        if (texto.length < 1) {
            super.throwUsageError(msg, this, `Você precisa especificar algo para eu repetir!`);
            return;
        }

        texto = Util.cleanMentions(texto);

        msg.reply(texto);
    }

    getName() {
        return "falar"
    }

    getCategory() {
        return "Diversão"
    }

    getDescription() {
        return "Faz eu repetir o texto especificado!"
    }

    getUsage() {
        return "say <text>"
    }

    getExample() {
        return "say Hey there!"
    }

    getAliases() {
        return ["say"]
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

module.exports = SayCommand;
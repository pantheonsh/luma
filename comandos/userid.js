const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");

class UserIDCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let isRaw = args[args.length - 1] === ":r";

        let user = msg.mentions.users.first() || msg.author;

        if (user) {
            if (isRaw) {
                msg.channel.send(user.id);
            } else {
                let embed = new Discord.RichEmbed();
                embed.addField("ID do usuário " + user.tag, "```" + user.id + "```");
                embed.setThumbnail(user.avatarURL);
                msg.reply({
                    embed
                })
            }
        } else {
            super.throwUsageError(msg, this, "Usuário desconhecido.");
            return;
        }
    }

    getName() {
        return "userid"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription() {
        return "Mostra o ID de um usuário. Adicione \":r\" como argumento para enviar sem embed (útil para celulares)."
    }

    getUsage() {
        return "userinfo @menção :r"
    }

    getExample() {
        return "userinfo @Pantheon#6263 :r"
    }

    getAliases() {
        return ["usuárioid", "usuarioid"]
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

module.exports = UserIDCommand;
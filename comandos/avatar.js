const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");

class AvatarCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let usr = msg.mentions.users.first() || msg.author;

        let embed = new Discord.RichEmbed();
        embed.setTitle(`🏕 Avatar de ${usr.tag}`);
        embed.addField("\u200B", `[Baixar](${usr.avatarURL})`);
        embed.setImage(usr.avatarURL);
        msg.reply({
            embed
        });
    }

    getName() {
        return "avatar"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription() {
        return "Visualiza e extrai o avatar do usuário mencionado!"
    }

    getUsage() {
        return "avatar @Usuário"
    }

    getExample() {
        return "avatar @Pantheon"
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

module.exports = AvatarCommand;
const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");

class OAuth2InviteCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let mention = msg.mentions.users.first();

        let bot = client.user;

        //if(mention && mention.bot) bot = mention;

        let embed = new Discord.RichEmbed();

        embed.setColor(0x9575CD);
        embed.setAuthor(bot.tag, bot.avatarURL);

        msg.reply(`Aqui está meu convite!\nhttps://discordapp.com/oauth2/authorize?response_type=code&scope=bot&client_id=${bot.id}`);
    }

    getName() {
        return "invite"
    }

    getCategory() {
        return; // nada
    }

    getDescription() {
        return "Retorna um link que pode ser usado para adicionar eu ou outro bot em outros servidores."
    }

    getUsage() {
        return "invite"
    }

    getExample() {
        return "invite"
    }

    getAliases() {
        return ["convite"]
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

module.exports = OAuth2InviteCommand;
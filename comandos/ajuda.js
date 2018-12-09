const Command = require("../sistemas/Command.js");
const Util = require("../sistemas/Util.js");
const Discord = require("discord.js");

const MaxCommandsPerPage = 10;

class HelpCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let e_ = new Discord.RichEmbed();

        e_.setAuthor(client.user.tag, client.user.avatarURL);

        e_.setDescription([
            "Aqui estão alguns links úteis:", "",
            "🛠 Você pode mudar como eu funciono (e até ativar algumas funções) pelo dashboard: https://luma.glitch.me/guildSelect", "",
            "🌀 Eu tenho vários comandos! Você pode ver quais são eles através de uma organizada interface: http://luma.glitch.me/comandos", "",
            "🏳️ Ah, não se esqueça de visitar meu servidor para bater um papo 🔝: https://discordapp.com/invite/yZHwmyp"
        ].join("\n"));

        msg.author.send({
            embed: e_
        });
        msg.reply("Enviei algo para você nas mensagens diretas! (tenha certeza que você ativou DMs aqui)");
    }

    getName() {
        return "ajuda"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription() {
        return "Mostra todos os meus comandos!"
    }

    getUsage() {
        return "ajuda <página>"
    }

    getExample() {
        return "ajuda"
    }

    getAliases() {
        return ["help"]
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

module.exports = HelpCommand;
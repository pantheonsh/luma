const PastebinAPI = require('pastebin-js');

const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const snfetch = require("snekfetch");

class PastebinhoCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {

        let texto = (args.join(" "));

        if (texto.length < 1) {
            super.throwUsageError(msg, this, `Você deve especificar algum texto para eu colocar no Pastebin.`);
            return;
        }

        const pastebinho = new PastebinAPI({
            'api_dev_key': args.config.pastebinho_api
        });

        pastebinho.createPaste(texto).then(link => {
            let embed = new Discord.RichEmbed();
            embed.setTitle("🗒 Pastebin");
            embed.addField("\u200B", `[Baixar](${link})`);
            msg.reply({
                embed
            });
        }).catch(() => {

        });
    }

    getName() {
        return "pastebin"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription() {
        return "Cria uma postagem no Pastebin!"
    }

    getUsage() {
        return "pastebin <texto>"
    }

    getExample() {
        return "pastebin Lorem Ipsum"
    }

    getAliases() {
        return ["pastebinho", "paste"]
    }

    getPermissions() {
        return {
            "bot": ["EMBED_LINKS"],
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

module.exports = PastebinhoCommand;
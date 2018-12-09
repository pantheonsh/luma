const Command = require("../sistemas/Command.js");
const snfetch = require("snekfetch");
const Discord = require("discord.js");
const JSDOM = require("jsdom").JSDOM;

class BDSCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        var r = await snfetch.get("http://biscoitodasorte.com/");

        let DOM = new JSDOM(r.body.toString());

        let embed = new Discord.RichEmbed();

        embed.setTitle("Biscoito da sorte");

        embed.setThumbnail("https://pbs.twimg.com/profile_images/2281306843/Biscoito_Sorte2.png");

        embed.setDescription([
            DOM.window.document.querySelector(".texto-biscoito").textContent,
            "**" + DOM.window.document.querySelector(".numero-sorte").textContent + "**"
        ]);

        msg.reply({
            embed
        });
    }

    getName() {
        return "biscoitodasorte"
    }

    getCategory() {
        return "Diversão"
    }

    getDescription() {
        return "Tem uma mensagem especial aguardando você!"
    }

    getUsage() {
        return "biscoitodasorte"
    }

    getExample() {
        return "biscoitodasorte"
    }

    getAliases() {
        return ["bds"]
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

module.exports = BDSCommand;
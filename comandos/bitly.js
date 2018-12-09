const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const snfetch = require("snekfetch");

class BitlyCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {

        let longURL = args.join(" ");

        snfetch.get("https://api-ssl.bitly.com/v3/shorten?access_token=" + encodeURIComponent(args.config.bitly_api_access_token) + "&longURL=" + encodeURIComponent(longURL)).then(r => {
            let body = r.body;
            if (body.status_code === 200) {

                let embed = new Discord.RichEmbed();

                embed.setColor(0x00C853);

                embed.setTitle(`📩 Encurtador de URLs`);

                embed.addField("\u200B", [
                    `🗞 URL encurtada: ${body.data.url}`,
                    `[Link](${body.data.url})`
                ]);

                msg.reply({
                    embed
                });
            } else {
                super.throwCommandError(msg, this, "Bit.ly: " + body.status_txt);
            }
        }).catch(err => {
            super.throwCommandError(msg, this, `Um erro ocorreu ao contatar o serviço bit.ly!`);
        });
    }

    getName() {
        return "bitly"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription() {
        return "Com este comando, eu encurtarei o URL especificado usando bit.ly!"
    }

    getUsage() {
        return "bitly <url>"
    }

    getExample() {
        return "bitly www.youtube.com/watch?v=dQw4w9WgXcQ"
    }

    getAliases() {
        return ["bit.ly", "encurtarurl"]
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

module.exports = BitlyCommand;
const Command = require("../sistemas/Command.js");
const Variables = require("../sistemas/CommmandVariables");
const Discord = require("discord.js");
const scraper = require('google-search-scraper');

class GoogleCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let query = args.join(" ");

        const userSolver = {
            solve: async (imageData, cb) => {
                let m_ = await msg.reply("⚠ **Captcha**\n" +
                    "<:blank:425018054850904074> Para evitar abusos, é necessário que o seguinte captcha seja completado:", {
                        files: [imageData]
                    });

                let c = msg.channel.createMessageCollector(m => m.author.id === msg.author.id, {
                    time: 60000
                });
                c.on("collect", m => {
                    m_.delete();
                    c.stop();
                    let text = m.content;
                    let id = null;
                    cb(err, id, text)
                });
            }
        }

        if (!query) {
            this.throwUsageError(msg, this, "Nenhum termo de pesquisa foi especificado.");
            return;
        }

        let first = true;

        scraper.search({
            query: query,
            solver: userSolver,
            host: "www.google.com.br",
            limit: 1
        }, (err, url) => {
            if (!first) return;
            first = false;
            if (err) {
                console.error(err);
                this.throwCommandError(msg, this, err);
                return;
            }

            msg.reply(url);
        });
    }

    getName() {
        return "google"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription() {
        return "Pesquisa no Google."
    }

    getUsage() {
        return "google <termos de pesquisa>"
    }

    getExample() {
        return "google dQw4w9WgXcQ"
    }

    getAliases() {
        return ["g"]
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

module.exports = GoogleCommand;
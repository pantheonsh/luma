const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const youtubeSearch = require('youtube-api-v3-search');
const Util = require("../sistemas/Util");

class YoutubeSearchCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let search = (args.join(" ")) || Util.randomItemFromArray([
            "dQw4w9WgXcQ", "U06jlgpMtQs", "jqE8M2ZnFL8",
            "L_jWHffIx5E", "Slpz0D35oRI", "ZZ5LpwO-An4",
            "2Z4m4lnjxkY", "QH2-TGUlwu4", "PfYnvDL0Qcw",
            "pMhfbLRoGEw", "pMhfbLRoGEw", "pMhfbLRoGEw"
        ]);

        let results = await youtubeSearch(Util.randomItemFromArray(["AIzaSyBbGIZB2W9bJlneqNVpXXH2g0hJFy4W9ek", "AIzaSyBUz0Q0Em4younDKC2J6qaF7WLgh8nT4ZU"]), {
            q: search,
            part: "snippet",
            type: "video"
        });

        let r = results.items[0];

        if (!r) {
            let embed = new Discord.RichEmbed();
            embed.setTitle("⚠ Erro!");
            embed.addField("Nenhum resultado encontrado.", "Você pesquisou por: `" + search + "`");
            return;
        }

        let embed = new Discord.RichEmbed();
        embed.setTitle(r.snippet.title);
        embed.setURL(`https://www.youtube.com/watch?v=${r.id.videoId}`);
        embed.setThumbnail(r.snippet.thumbnails.high.url);
        embed.setFooter(r.snippet.channelTitle);
        embed.setDescription(r.snippet.description);

        msg.reply(embed.url, {
            embed
        });
    }

    getName() {
        return "youtubesearch"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription() {
        return "Faz uma pesquisa no YouTube."
    }

    getUsage() {
        return "youtubesearch <termos de pesquisa>"
    }

    getExample() {
        return "youtubesearch Nyan Cat"
    }

    getAliases() {
        return ["yts", "ytsearch", "youtubepesquisa", "pesquisayoutube", "ytpesquisa"]
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

module.exports = YoutubeSearchCommand;
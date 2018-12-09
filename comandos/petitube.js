const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const snfetch = require("snekfetch");
const Util = require("../sistemas/Util.js");

class PetitTubeCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let request = await snfetch.get("http://www.petittube.com/");

        let body = request.body.toString();

        let videoURLEmbed = body.match(new RegExp('<iframe width="630" height="473" src="' + "(.*)" + '" frameborder="0" allowfullscreen></iframe>'))[1];
        let videoID = videoURLEmbed.match(new RegExp("http://www.youtube.com/embed/" + "(.*)" + "?version="))[1].replace("?", "");
        let videoURL = "https://www.youtube.com/watch?v=" + videoID;

        msg.reply([
            `O vídeo a seguir é um vídeo aleatório do YouTube, e não está de forma alguma associado a Luma ou seu criador.`,
            videoURL
        ]);
    }

    getName() {
        return "videoaleatorio"
    }

    getCategory() {
        return "Diversão"
    }

    getDescription() {
        return Util.emojis.youtube + " Nesse comando, eu procuro um vídeo de baixa qualidade aleatório no YouTube, para o sofrimento geral da nação!"
    }

    getUsage() {
        return "videoaleatorio"
    }

    getExample() {
        return "videoaleatorio"
    }

    getAliases() {
        return ["videoaleatório", "vídeoaleatório", "vídeoaleatorio", "youtuberandom", "randomyoutube"]
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

module.exports = PetitTubeCommand;
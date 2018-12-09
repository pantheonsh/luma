const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const Jimp = require("jimp");

class WallpaperGeneratorCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        Jimp.read("https://picsum.photos/1600/900/?random", (err, img) => {
            if(err) {
                super.throwCommandError(msg, this, err);
                return;
            }

            img.blur(200);

            img.getBuffer(Jimp.MIME_PNG, (err, buf) => {
                msg.reply({
                    files: [{
                        attachment: buf,
                        name: "wallpaper.png"
                    }]
                });
            });
        });
    }

    getName(){
        return "wallpaper"
    }

    getCategory() {
        return "Imagens"
    }

    getDescription(){
        return "Gera um wallpaper aleatório"
    }

    getUsage(){
        return "wallpaper"
    }

    getExample(){
        return "wallpaper"
    }

    getAliases(){
        return ["wallpaper_random"]
    }

    getPermissions(){
        return {
            "bot": [],
            "user": [],
            "owner": false
        }
    }

    // retorna uma Array contendo os tipos de canais
    // onde o comando pode ser executado.
    getSupportedTextChannels(){
        return [
            "dm", // pv
            "group", // pv em grupo
            "text", // canal de texto numa guild
        ]
    }
}

module.exports = WallpaperGeneratorCommand;
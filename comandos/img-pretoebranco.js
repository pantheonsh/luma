const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const Jimp = require("jimp");

class IMGGrayScaleCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;
        
        Jimp.read(imagemAtt.url, (err, img) => {
            if(err) {
                super.throwCommandError(msg, this, err);
                return;
            }

            img.grayscale().getBuffer(Jimp.MIME_PNG, (err, buf) => {
                if(err) {
                    super.throwCommandError(msg, this, err);
                    return;
                }

                msg.reply({
                    files: [{
                        attachment: buf,
                        name: "grayscale.png"
                    }]
                });
            });
        });
    }

    getName(){
        return "pretoebranco"
    }

    getCategory() {
        return "Imagens"
    }

    getDescription(){
        return "Deixa uma imagem em preto e branco."
    }

    getUsage(){
        return "pretoebranco"
    }

    getExample(){
        return "pretoebranco"
    }

    getAliases(){
        return ["grayscale", "greyscale"]
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

module.exports = IMGGrayScaleCommand;

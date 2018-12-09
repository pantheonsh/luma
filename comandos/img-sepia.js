const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const Jimp = require("jimp");

class IMGSepiaCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;
        
        Jimp.read(imagemAtt.url, (err, img) => {
            if(err) {
                super.throwCommandError(msg, this, err);
                return;
            }

            img.sepia().getBuffer(Jimp.MIME_PNG, (err, buf) => {
                if(err) {
                    super.throwCommandError(msg, this, err);
                    return;
                }

                msg.reply({
                    files: [{
                        attachment: buf,
                        name: "sepia.png"
                    }]
                });
            });
        });
    }

    getName(){
        return "sépia"
    }

    getCategory() {
        return "Imagens"
    }

    getDescription(){
        return "Deixa uma imagem em sépia."
    }

    getUsage(){
        return "sÃ©sépia <imagem>"
    }

    getExample(){
        return "sépia"
    }

    getAliases(){
        return ["sepia"]
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

module.exports = IMGSepiaCommand;

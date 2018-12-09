const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const Jimp = require("jimp");

class IMGBlurCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;

        let factor = parseInt(args[0]) || 5;
      
      factor < 1 ? factor = 5 : factor;
        
        Jimp.read(imagemAtt.url, (err, img) => {
            if(err) {
                super.throwCommandError(msg, this, err);
                return;
            }

            img.blur(factor);

            img.getBuffer(Jimp.MIME_PNG, (err, buf) => {
                msg.reply({
                    files: [{
                        attachment: buf,
                        name: "blur.png"
                    }]
                });
            });
        });
    }

    getName(){
        return "desfoque"
    }

    getCategory() {
        return "Imagens"
    }

    getDescription(){
        return "Desfoca uma imagem pelo fator ƒ (padrão 5)."
    }

    getUsage(){
        return "desfoque ƒ"
    }

    getExample(){
        return "desfoque 10"
    }

    getAliases(){
        return ["blur"]
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

module.exports = IMGBlurCommand;
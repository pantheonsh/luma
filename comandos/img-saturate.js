const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const Util = require("../sistemas/Util");
const Jimp = require("jimp");

class IMGSaturateCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;

        // se for "true", irá saturar
        // senão, irá "desaturar"
        let saturar = true;

        let factor = parseInt(args[0]) || 100;

        if(factor < 0) saturar = false;

        factor = Math.abs(factor);

        if(factor < 0) factor = 0;
        if(factor > 100) factor = 100;

        Jimp.read(imagemAtt.url, (err, img) => {
            if(err) {
                super.throwCommandError(msg, this, err);
                return;
            }

            img.color([
                saturar 
                    ? { apply: "saturate", params: [factor] }
                    : { apply: "desaturate", params: [factor] }
            ]);

            img.getBuffer(Jimp.MIME_PNG, (err, buf) => {
                msg.reply({
                    files: [{
                        attachment: buf,
                        name: "saturar.png"
                    }]
                });
            });
        });
    }

    getName(){
        return "saturação"
    }

    getCategory() {
        return "Imagens"
    }

    getDescription(){
        return "Altera a saturação de uma imagem (deve estar entre -100 e 100)."
    }

    getUsage(){
        return "saturação f"
    }

    getExample(){
        return "saturação -48"
    }

    getAliases(){
        return ["saturar", "saturacao", "saturate"]
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

module.exports = IMGSaturateCommand;
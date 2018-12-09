const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const Util = require("../sistemas/Util");
const Jimp = require("jimp");

class IMGBrightnessCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;

        let factor = parseInt(args[0]) || 5;

        factor < -100 ? factor = 0 : factor;
        factor > 100 ? factor = 0 : factor;

        factor = Util.convertRange(factor, [-100, 100], [-1, 1]);

        Jimp.read(imagemAtt.url, (err, img) => {
            if(err) {
                super.throwCommandError(msg, this, err);
                return;
            }

            img.brightness(factor).getBuffer(Jimp.MIME_PNG, (err, buf) => {
                msg.reply({
                    files: [{
                        attachment: buf,
                        name: "brilho.png"
                    }]
                });
            });
        });
    }

    getName(){
        return "brilho"
    }

    getCategory() {
        return "Imagens"
    }

    getDescription(){
        return "Altera o brilho de uma imagem pelo fator f (padrÃ£o 0). Se f for negativo, o brilho diminuirá. Se for positivo, o brilho aumentará."
    }

    getUsage(){
        return "brilho f"
    }

    getExample(){
        return "brilho 10"
    }

    getAliases(){
        return ["brightness"]
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

module.exports = IMGBrightnessCommand;

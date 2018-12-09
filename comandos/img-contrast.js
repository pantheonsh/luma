const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const Util = require("../sistemas/Util");
const Jimp = require("jimp");

class IMGContrastCommand extends Command {
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

            img.contrast(factor).getBuffer(Jimp.MIME_PNG, (err, buf) => {
                msg.reply({
                    files: [{
                        attachment: buf,
                        name: "contraste.png"
                    }]
                });
            });
        });
    }

    getName(){
        return "contraste"
    }

    getCategory() {
        return "Imagens"
    }

    getDescription(){
        return "Altera o contraste de uma imagem pelo fator f (padrÃ£o 0). Se f for negativo, o contraste diminuirá. Se for positivo, o contraste aumentará."
    }

    getUsage(){
        return "contraste f"
    }

    getExample(){
        return "contraste 10"
    }

    getAliases(){
        return ["contrast"]
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

module.exports = IMGContrastCommand;

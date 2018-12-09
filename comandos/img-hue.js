const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const Util = require("../sistemas/Util");
const Jimp = require("jimp");

class IMGHueCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;

        let factor = parseInt(args[0]) || 50;

        if(factor < -100) factor = -100;
        if(factor > 100) factor =  100;

        factor = Util.convertRange(factor, [-100, 100], [-360, 360]);

        Jimp.read(imagemAtt.url, (err, img) => {
            if(err) {
                super.throwCommandError(msg, this, err);
                return;
            }

            img.color([
                { apply: "hue", params: [factor] }
            ]);

            img.getBuffer(Jimp.MIME_PNG, (err, buf) => {
                msg.reply({
                    files: [{
                        attachment: buf,
                        name: "hue.png"
                    }]
                });
            });
        });
    }

    getName(){
        return "hue"
    }

    getCategory() {
        return "Imagens"
    }

    getDescription(){
        return "Altera o hue de uma imagem pelo fator f (deve estar entre -100 e 100)."
    }

    getUsage(){
        return "hue f"
    }

    getExample(){
        return "hue 36"
    }

    getAliases(){
        return ["spin"]
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

module.exports = IMGHueCommand;
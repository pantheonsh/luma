const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");

class IMGFlipCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;
        let imagemBuf = await imageUtil.download(imagemAtt.url);
        if(!imagemBuf) return;

        let canvas = canvasAPI.createCanvas(imagemAtt.width, imagemAtt.height)
        let ctx = canvas.getContext("2d");

        let i = new canvasAPI.Image();
        i.src = imagemBuf;

        ctx.scale(1, -1);

        ctx.drawImage(i, 0, -i.height, i.width, i.height);

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "mirror.png"
            }]
        });
    }

    getName(){
        return "inverter"
    }

    getCategory() {
        return "Imagens"
    }

    getDescription(){
        return "Inverte uma imagem verticalmente. Para espelhar uma imagem, use o comando `espelhar`."
    }

    getUsage(){
        return "inverter <imagem>"
    }

    getExample(){
        return "inverter"
    }

    getAliases(){
        return ["flip"]
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

module.exports = IMGFlipCommand;
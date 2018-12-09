const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/jovensdehoje.png");

class JovensDeHojeCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let canvas = canvasAPI.createCanvas(369, 300);
        let ctx = canvas.getContext("2d");

        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;
        let imagemBuf = await imageUtil.download(imagemAtt.url);
        if(!imagemBuf) return;

        let imagem = new canvasAPI.Image();
        imagem.src = imagemBuf;

        ctx.drawImage(BASE_IMG, 0, 0);
        ctx.drawImage(imagem, 186, 144, 183, 152);

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "jovensdehoje.png"
            }]
        });
    }

    getName(){
        return "jovensdehoje"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Cuidado filha, esses jovens de hoje em dia só pensam em uma coisa."
    }

    getUsage(){
        return "jovensdehoje <imagem>"
    }

    getExample(){
        return "jovensdehoje"
    }

    getAliases(){
        return ["jdh"]
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

module.exports = JovensDeHojeCommand;
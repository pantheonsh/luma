const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/vanish.png");

const PADDING = 30;

class VanishCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let canvas = canvasAPI.createCanvas(640, 480);
        let ctx = canvas.getContext("2d");

        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;
        let imagemBuf = await imageUtil.download(imagemAtt.url);
        if(!imagemBuf) return;

        let imagem = new canvasAPI.Image();
        imagem.src = imagemBuf;

        ctx.drawImage(BASE_IMG, 0, 0);
        ctx.drawImage(imagem, 75, 253, 128, 128);

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "vanish.png"
            }]
        });
    }

    getName(){
        return "vanish"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "*Vanish tira até merda da roupa!*"
    }

    getUsage(){
        return "vanish <imagem>"
    }

    getExample(){
        return "vanish"
    }

    getAliases(){
        return []
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

module.exports = VanishCommand;
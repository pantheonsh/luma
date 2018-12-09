const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");
const Util = require("../sistemas/Util");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/sam.png");

class SAMWatermarkCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){

        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;
        let imagemBuf = await imageUtil.download(imagemAtt.url);
        if(!imagemBuf) return;

        let imagem = new canvasAPI.Image();
        imagem.src = imagemBuf;

        let canvas = canvasAPI.createCanvas(imagem.width, imagem.height);
        let ctx = canvas.getContext("2d");

        ctx.drawImage(imagem, 0, 0);
        ctx.drawImage(BASE_IMG, 
            Util.getRandomInt((imagem.width / 4), (imagem.width / 2)), 
            Util.getRandomInt((imagem.height / 4), (imagem.height / 2)),
            Math.floor(imagem.width/2), Math.floor(imagem.height/2));

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "sam.png"
            }]
        });
    }

    getName(){
        return "sam"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Coloca o anti-kibe da SAM sobre uma imagem."
    }

    getUsage(){
        return "sam <imagem>"
    }

    getExample(){
        return "sam"
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

module.exports = SAMWatermarkCommand;
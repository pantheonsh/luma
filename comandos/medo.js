const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/medo.png");

class HomensTemMedoCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let canvas = canvasAPI.createCanvas(BASE_IMG.width, BASE_IMG.height);
        let ctx = canvas.getContext("2d");

        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;
        let imagemBuf = await imageUtil.download(imagemAtt.url);
        if(!imagemBuf) return;

        let imagem = new canvasAPI.Image();
        imagem.src = imagemBuf;

        ctx.drawImage(BASE_IMG, 0, 0);
        ctx.drawImage(imagem, 0, 425, 320, 225);

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "medo.png"
            }]
        });
    }

    getName(){
        return "medo"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Do que homens tem medo?"
    }

    getUsage(){
        return "medo <imagem>"
    }

    getExample(){
        return "medo"
    }

    getAliases(){
        return ["oquehomenstemmedo"]
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

module.exports = HomensTemMedoCommand;
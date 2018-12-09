const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/lula.png");

class Lula2018Command extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let canvas = canvasAPI.createCanvas(300, 300);
        let ctx = canvas.getContext("2d");

        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;
        let imagemBuf = await imageUtil.download(imagemAtt.url);
        if(!imagemBuf) return;

        let imagem = new canvasAPI.Image();
        imagem.src = imagemBuf;

        ctx.drawImage(imagem, 0, 0, 300, 300);
        ctx.drawImage(BASE_IMG, 0, 0);

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "lula.png"
            }]
        });
    }

    getName(){
        return "lula2018"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Filtro da campanha do Lula."
    }

    getUsage(){
        return "lula2018 <imagem>"
    }

    getExample(){
        return "lula2018"
    }

    getAliases(){
        return ["lula", "lulinha"]
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

module.exports = Lula2018Command;
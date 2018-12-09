const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/cebolinha.png");

class CebolinhaCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let canvas = canvasAPI.createCanvas(552, 626);
        let ctx = canvas.getContext("2d");

        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;
        let imagemBuf = await imageUtil.download(imagemAtt.url);
        if(!imagemBuf) return;

        let imagem = new canvasAPI.Image();
        imagem.src = imagemBuf;

        ctx.drawImage(imagem, 189, 0, 370, 370);
        ctx.drawImage(BASE_IMG, 0, 0);

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "cebolinha.png"
            }]
        });
    }

    getName(){
        return "cebolinha"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Colagem né?"
    }

    getUsage(){
        return "cebolinha <imagem>"
    }

    getExample(){
        return "cebolinha"
    }

    getAliases(){
        return ["colagemne", "colagemné"]
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

module.exports = CebolinhaCommand;
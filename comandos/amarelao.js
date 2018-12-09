const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/amarelao.png");

class AmarelaoCommand extends Command {
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
        ctx.drawImage(imagem, 289, 75, 70, 66);

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "amarelao.png"
            }]
        });
    }

    getName(){
        return "amarelao"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Cuidado com o que diz, vai deixar meu cão com complexo de inferioridade uai"
    }

    getUsage(){
        return "amarelao <imagem>"
    }

    getExample(){
        return "amarelao"
    }

    getAliases(){
        return ["amarelão"]
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

module.exports = AmarelaoCommand;
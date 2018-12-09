const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/traindo.png");

class DeveEstarMeTraindoCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let canvas = canvasAPI.createCanvas(236, 300);
        let ctx = canvas.getContext("2d");

        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;
        let imagemBuf = await imageUtil.download(imagemAtt.url);
        if(!imagemBuf) return;

        let imagem = new canvasAPI.Image();
        imagem.src = imagemBuf;

        ctx.drawImage(imagem, 122, 173, 89, 70);
        ctx.drawImage(BASE_IMG, 0, 0);

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "deveestarmetraindo.png"
            }]
        });
    }

    getName(){
        return "deveestarmetraindo"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Ele demora para responder, deve estar me traindo."
    }

    getUsage(){
        return "deveestarmetraindo <imagem>"
    }

    getExample(){
        return "deveestarmetraindo"
    }

    getAliases(){
        return ["demt", "dmt"]
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

module.exports = DeveEstarMeTraindoCommand;
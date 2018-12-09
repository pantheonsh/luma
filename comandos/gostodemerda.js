const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/merda2.png");

class GostoDeMerdaCommand extends Command {
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

        ctx.drawImage(imagem, 113, 442, 229, 229);
        ctx.drawImage(BASE_IMG, 0, 0);

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "merda.png"
            }]
        });
    }

    getName(){
        return "gostodemerda"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Pisar na merda não era suficiente, o café tem que ter gosto de merda."
    }

    getUsage(){
        return "gostodemerda <imagem>"
    }

    getExample(){
        return "gostodemerda"
    }

    getAliases(){
        return ["merda2"]
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

module.exports = GostoDeMerdaCommand;
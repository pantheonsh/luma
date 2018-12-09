const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/lixo.png");

class PleasePlaceTrashHereCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let canvas = canvasAPI.createCanvas(BASE_IMG.width, BASE_IMG.height);
        let ctx = canvas.getContext("2d");

        let imagemAtt = await imageUtil.resolveImage(msg);
        if(!imagemAtt) return;
        let url = imagemAtt.url;
        if(url === client.user.avatarURL) url = "https://i.imgur.com/sbu5aS6.png";
        let imagemBuf = await imageUtil.download(url);
        if(!imagemBuf) return;

        let imagem = new canvasAPI.Image();
        imagem.src = imagemBuf;

        ctx.drawImage(BASE_IMG, 0, 0);
        ctx.drawImage(imagem, 156, 441, 105, 105);

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "lixo.png"
            }]
        });
    }

    getName(){
        return "lixo"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Please place trash here."
    }

    getUsage(){
        return "lixo <imagem>"
    }

    getExample(){
        return "lixo"
    }

    getAliases(){
        return ["trash"]
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

module.exports = PleasePlaceTrashHereCommand;
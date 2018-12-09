const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/wasted.png");

      function grayScale(context, canvas) {
        var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
            var pixels  = imgData.data;
            for (var i = 0, n = pixels.length; i < n; i += 4) {
            var grayscale = pixels[i] * .3 + pixels[i+1] * .59 + pixels[i+2] * .11;
            pixels[i  ] = grayscale;        // red
            pixels[i+1] = grayscale;        // green
            pixels[i+2] = grayscale;        // blue
            //pixels[i+3]              is alpha
        }
        //redraw the image in black & white
        context.putImageData(imgData, 0, 0);
      }

class WastedCommand extends Command {
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

        grayScale(ctx, canvas);

        ctx.drawImage(BASE_IMG, Math.floor((imagem.width / 2) - (BASE_IMG.width / 2)), Math.floor((imagem.height / 2) - (BASE_IMG.height / 2)));

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "wasted.png"
            }]
        });
    }

    getName(){
        return "wasted"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Coloca a tela de morte do GTA V sobre uma imagem."
    }

    getUsage(){
        return "wasted <imagem>"
    }

    getExample(){
        return "wasted"
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

module.exports = WastedCommand;
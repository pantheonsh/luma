const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/vaidaocumano.png");

const PADDING = 30;

class VaiDaoCuManoCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let canvas = canvasAPI.createCanvas(522, 386);
        let ctx = canvas.getContext("2d");

        let texto = args.join(" ") || "Aí o macaco da sala dá spoiler de MLP";

        ctx.font = "24pt Arial, Helvetica, sans-serif";
        ctx.textAlign="center"; 

        let linhas = imageUtil.wrapText(ctx, texto, PADDING, 23, canvas.width - PADDING, 30);

        let h = 0;
        let prevY = 0;

        linhas.forEach(linha => {
            h += (linha.y - prevY);
            prevY = linha.y;
        });

        canvas.height = canvas.height + h + PADDING;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#161616";

        linhas.forEach(linha => {
            ctx.fillText(linha.text, Math.floor(canvas.width/2), linha.y + (PADDING/2));
        });

        //canvas.height = canvas.height;
        ctx.drawImage(BASE_IMG, 0, h + PADDING);

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "vdoc.png"
            }]
        });
    }

    getName(){
        return "vaidaocumano"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Comando feito pelo Bart, end quote."
    }

    getUsage(){
        return "vaidaocumano <texto>"
    }

    getExample(){
        return "vaidaocumano Aí o macaco da sala dá spoiler de MLP"
    }

    getAliases(){
        return ["vdocm", "vdcm", "vai arocumano"]
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

module.exports = VaiDaoCuManoCommand;
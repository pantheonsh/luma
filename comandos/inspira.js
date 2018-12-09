const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/inspira.png");

const PADDING = 40;

class INSPIRA_XXXXXXX_Command extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let canvas = canvasAPI.createCanvas(BASE_IMG.width, BASE_IMG.height);
        let ctx = canvas.getContext("2d");

        let texto = args.join(" ");

        if(!texto) {
            super.throwUsageError(msg, this, "Nenhum texto especificado.");
            return;
        }

        texto = texto.toUpperCase();

        ctx.font = "bold 72pt Arial, Helvetica, sans-serif";
        ctx.textAlign="center"; 

        let linhas = imageUtil.wrapText(ctx, texto, -20, 900, canvas.width - PADDING, 96);

        let h = 0;
        let prevY = 0;

        linhas.forEach(linha => {
            h += (linha.y - prevY);
            prevY = linha.y;
        });

        ctx.fillStyle = "#FFFFFF";

        ctx.drawImage(BASE_IMG, 0, 0);

        ctx.save();
        ctx.rotate(-3 * (Math.PI / 180));
        linhas.forEach(linha => {
            ctx.fillText(linha.text, (canvas.width / 2) - 52, linha.y + (PADDING/2));
        });
        ctx.restore();

        //canvas.height = canvas.height;

        msg.reply({
            files: [{
                attachment: canvas.toBuffer(),
                name: "inspira_AAAAAAAAA.png"
            }]
        });
    }

    getName(){
        return "grito"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "*inspira* AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    }

    getUsage(){
        return "grito <texto>"
    }

    getExample(){
        return "grito OBRIGADO POR EXISTIR"
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

module.exports = INSPIRA_XXXXXXX_Command;
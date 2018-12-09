const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const imageUtil = require("../sistemas/imageUtil");
const canvasAPI = require("canvas");
const fs = require("fs");

const BASE_IMG = new canvasAPI.Image(); 
      BASE_IMG.src = fs.readFileSync("./imagens/hackerman.png");

const PADDING = 40;

class HackermanCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler){
        let canvas = canvasAPI.createCanvas(BASE_IMG.width, BASE_IMG.height);
        let ctx = canvas.getContext("2d");

        let texto = args.join(" ");

        if(!texto) {
            super.throwUsageError(msg, this, "Nenhum texto especificado.");
            return;
        }

        ctx.font = "32pt Arial, Helvetica, sans-serif";
        ctx.textAlign="center"; 

        let linhas = imageUtil.wrapText(ctx, texto, PADDING, 32, canvas.width - PADDING, 40);

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
                name: "hackerman.png"
            }]
        });
    }

    getName(){
        return "hackerman"
    }

    getCategory() {
        return "Memes"
    }

    getDescription(){
        return "Quando você tem 11 anos e descobre a senha do Wi-Fi."
    }

    getUsage(){
        return "hackerman <texto>"
    }

    getExample(){
        return "hackerman Eis que você tem 11 anos e acessa a Deep Web"
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

module.exports = HackermanCommand;
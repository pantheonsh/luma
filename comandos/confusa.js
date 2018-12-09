const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");

class ConfusaCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let str = args.join(" ");

        if (str.length < 1) {
            super.throwUsageError(msg, this, `Você precisa especificar alguma frase para eu escrever!`);
            return;
        }

        let url = "https://luma-canvas.glitch.me/confusedLady.png?id=" + encodeURIComponent(str);

        let embed = new Discord.RichEmbed();

        embed.setColor(0x00E676);

        embed.setTitle(`🤔 Confusa`);

        embed.setImage(url);

        embed.addField("\u200B", `[Baixar](url)`);

        msg.reply({
            embed
        });
    }

    getName() {
        return "confusa"
    }

    getCategory() {
        return "Memes"
    }

    getDescription() {
        return "Cria um meme [nesse estilo](https://i.imgflip.com/1fgcic.jpg)!"
    }

    getUsage() {
        return "confusa <texto>"
    }

    getExample() {
        return "confusa eis que você está fazendo a prova de matemática"
    }

    getAliases() {
        return ["memeconfusa", "mathlady"]
    }

    getPermissions() {
        return {
            "bot": [],
            "user": [],
            "owner": false
        }
    }

    // retorna uma Array contendo os tipos de canais
    // onde o comando pode ser executado.
    getSupportedTextChannels() {
        return [
            "dm", // pv
            "group", // pv em grupo
            "text", // canal de texto numa guild
        ]
    }
}

module.exports = ConfusaCommand;
const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");

class SkinCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let username = args[0];

        if (username.length < 1 || username.length > 16) {
            super.throwUsageError(msg, this, `No Minecraft, um nickname não pode ser ser maior que 16 caracteres nem menor que 0.`)
            return;
        }

        let embed = new Discord.RichEmbed();

        embed.setColor(0x546E7A);

        embed.setTitle("Skin searcher");

        embed.setImage("https://minotar.net/skin/" + encodeURIComponent(username));

        embed.setThumbnail("https://minotar.net/avatar/" + encodeURIComponent(username));

        embed.setDescription([
            `Essa é a skin do usuário ${username}.`,
            `[Baixar](${"https://minotar.net/skin/" + encodeURIComponent(username)})`
        ]);
        msg.reply({
            embed
        });
    }

    getName() {
        return "skin"
    }

    getCategory() {
        return "Diversão"
    }

    getDescription() {
        return "Procura uma skin Minecraft pelo nickname! **A conta deve ser original.**"
    }

    getUsage() {
        return "skin <nickname minecraft>"
    }

    getExample() {
        return "skin notch"
    }

    getAliases() {
        return ["skinminecraft", "minecraftskin"]
    }

    getPermissions() {
        return {
            "bot": ["EMBED_LINKS"],
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

module.exports = SkinCommand;
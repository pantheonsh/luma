const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const snfetch = require("snekfetch");

class MetallicaLogoGeneratorCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {

        let texto = args.join(" ").substring(0, 26) || "metallica";

        snfetch.post("http://metallica.alwaysdata.net/creation/")
            .attach("the_text", texto)
            .then(r => {
                let body = JSON.parse(r.body.toString());
                if (body.result === "success") {
                    let embed = new Discord.RichEmbed();

                    embed.setColor(0x9575CD);

                    embed.setTitle("🎵 Metallica");

                    embed.addField("\u200B", `[Baixar](${"http://metallica.alwaysdata.net/" + body.file})`);

                    embed.setImage("http://metallica.alwaysdata.net/" + body.file);

                    msg.reply({
                        embed
                    });
                } else {
                    console.error(r);
                    super.throwCommandError(msg, this, `Erro desconhecido.`)
                }
            });
    }

    getName() {
        return "metallica"
    }

    getCategory() {
        return "Diversão"
    }

    getDescription() {
        return "🎸 Nesse comando, criarei uma imagem baseada na logo do Metallica, contendo o texto especificado!"
    }

    getUsage() {
        return "metallica <texto>"
    }

    getExample() {
        return "metallica luma"
    }

    getAliases() {
        return ["metallicalogo"]
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

module.exports = MetallicaLogoGeneratorCommand;
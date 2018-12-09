const Command = require("../sistemas/Command.js");
const Loquendo = require("../sistemas/tts.js");
const Discord = require("discord.js");
const snfetch = require("snekfetch");

class LoquendoCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let texto = args.join(" ");

        if (texto.length < 1) {
            super.throwUsageError(msg, this, `O texto deve ter pelo menos 1 caractere.`);
            return;
        }

        let e = new Discord.RichEmbed();

        e.setColor(0xFFB74D);

        e.setTitle("💽 Loquendo TTS");
        e.setDescription([
            `Aguarde!`,
            "",
            `🗒 Texto:`,
            "*```",
            texto,
            "```*"
        ]);

        let m = await msg.reply({
            embed: e
        });

        Loquendo.toSpeech(texto).then(response => {
            let embed = new Discord.RichEmbed();
            embed.setTitle("💽 Loquendo TTS");
            embed.setDescription([
                `🗒 Texto:`,
                "*```",
                texto,
                "```*"
            ]);
            embed.addField("\u200B", `[Baixar](${response.audiourl})`);
            m.edit({
                embed
            });
        }).catch(ex => {
            super.throwCommandError(msg, this, `Erro desconhecido.`);
            console.error(ex);
        });
    }

    getName() {
        return "loquendo"
    }

    getCategory() {
        return "Diversão"
    }

    getDescription() {
        return "Sintetiza um texto para voz com o Loquendo!"
    }

    getUsage() {
        return "loquendo <texto>"
    }

    getExample() {
        return "loquendo Olá!"
    }

    getAliases() {
        return ["tts"]
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

module.exports = LoquendoCommand;
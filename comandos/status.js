const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const config = require("../config");
const os = require('os-utils');

class StatusCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        const shouldFlush = args.includes(":f");

        if (msg.author.id === config.ownerID && shouldFlush) {
            if (global.gc) global.gc();
        }

        const used = process.memoryUsage();

        let mem = [];

        for (let key in used) {
            mem.push(`**${key}**: \`${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\``);
        }

        os.cpuUsage(cpuPercent => {
            let embed = new Discord.RichEmbed();
            embed.addField("Memória", mem.join("\n"), true);
            embed.addField("CPU", [
                "**Uso (%)**: " + Math.round(cpuPercent * 100),
                "**N° de CPUs**: " + os.cpuCount(),
            ].join("\n"), true);
            if (shouldFlush) embed.setFooter("Flag :f presente - gc() chamado");
            msg.reply({
                embed
            });
        });
    }

    getName() {
        return "status"
    }

    getCategory() {
        return "Desenvolvimento"
    }

    getDescription() {
        return "Mostra os status da Luma (RAM, processador, etc)"
    }

    getUsage() {
        return "status"
    }

    getExample() {
        return "status"
    }

    getAliases() {
        return []
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

function msToHMS(ms) {
    var date = new Date(null);
    date.setMilliseconds(ms);
    var result = date.toISOString().substr(11, 8);
    return result;
}

module.exports = StatusCommand;
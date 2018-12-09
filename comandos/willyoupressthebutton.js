const snfetch = require("snekfetch");
const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const Util = require('../sistemas/Util');
const JSDOM = require("jsdom").JSDOM;

class WYPTBCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let MIN = 100;
        let MAX = 100000;

        let id = Util.getRandomInt(MIN, MAX);
        // primeiro, pegar pesquisas
        snfetch.get("http://willyoupressthebutton.com/" + id + "/stats/")
            .then(async r_ => {
                let DOM = new JSDOM(r_.text);

                let wrapper = DOM.window.document.querySelector(".search-dl");

                let cond = DOM.window.document.querySelector("#cond").textContent.substring(9).replace("\n", "");
                let res = DOM.window.document.querySelector("#res").textContent.substring(9).replace("\n", "")

                let howmanyPressed = DOM.window.document.querySelector(".statsBarLeft").textContent;
                let howmanynotPressed = DOM.window.document.querySelector(".statsBarRight").textContent;

                let embed = new Discord.RichEmbed();
                embed.setTitle("Você vai apertar o botão?");
                embed.setDescription(cond);
                embed.addField("`MAS`", res);

                let m = await msg.reply({
                    embed
                });

                await m.react("🖱");
                await m.react("🙅");
                let filter = (r, u) => {
                    let isValid = ["🖱", "🙅"].includes(r.emoji.name);
                    let isFromSameUser = u.id === msg.author.id;

                    return isValid && isFromSameUser;
                }

                let c = m.createReactionCollector(filter, {
                    time: 60000,
                    max: 1
                });
                c.on("collect", async r => {
                    r.emoji.name === "🖱" ?
                        embed.setTitle("🖱 Você apertou o botão!") :
                        embed.setTitle("🙅 Você não apertou o botão.")

                    embed.setDescription([
                        "Sabia que...",
                        "**__" + howmanyPressed + "__**pessoas apertaram o botão, enquanto **__" +
                        howmanynotPressed + "__**não apertaram?"
                    ]);

                    embed.fields = {};

                    await m.edit({
                        embed
                    });

                    await m.react("🔁");

                    let f = (r, u) => {
                        let isValid = r.emoji.name === "🔁";
                        let isFromSameUser = u.id === msg.author.id;

                        return isValid && isFromSameUser;
                    }
                    let c_ = m.createReactionCollector(f, {
                        time: 60000,
                        max: 1
                    });
                    c_.on("collect", () => {
                        m.delete();
                        this.execute(client, msg, args, CommandHandler, Database);
                    });
                });
            });
    }

    getName() {
        return "willyoupressthebutton"
    }

    getCategory() {
        return "Mini-games"
    }

    getDescription() {
        return "Você apertará o botão?"
    }

    getUsage() {
        return "willyoupressthebutton"
    }

    getExample() {
        return "willyoupressthebutton"
    }

    getAliases() {
        return ["wyptb", "wypb"]
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

module.exports = WYPTBCommand;
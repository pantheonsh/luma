const fs = require("fs");
const path = require("path");

const config = require("./config");

const Discord = require("discord.js");
const client = new Discord.Client();

const ClassCommandHandler = require("./sistemas/CommandHandler.js");
const CommandHandler = new ClassCommandHandler(path.join(__dirname, "comandos/"), config);

const DBL = require("./sistemas/DiscordBotList.js");

const Database = require("./db");

const Util = require("./sistemas/Util");

const DummyHTTPRequest = require("./sistemas/dummyhttprequest");

let CommandVariables = require("./sistemas/CommmandVariables");

const GuildJoinLeaveUtils = require("./sistemas/guildjoinleave");

client.on("ready", () => {
    console.info("Bot inicializado.");
    console.info(client.guilds.size, "guilds.");
    console.info(client.users.size, "usuários.");
    console.info(Object.keys(CommandHandler.commands).length, "comandos.");

    client.user.setActivity(`${client.guilds.size} servidores! 🍪`, {
        type: "WATCHING"
    });

    setInterval(() => {
        client.user.setActivity(Util.randomItemFromArray([
            `${client.guilds.size} servidores!`,
            `${Object.keys(CommandHandler.commands).length} comandos!`,
            `${client.users.size + Math.round(client.users.size / 3)} usuários!`
        ]), {
            type: "WATCHING"
        });

    }, 10000);

    DBL.postServerCount(client.guilds.size);
});

client.on("message", async msg => {
    if (msg.author.bot) return;

    let prefix = config.defaultPrefix;

    if (msg.guild) {
        let customPrefix = await Database.Prefix.get(msg.guild.id);
        if (customPrefix) prefix = customPrefix;
    }

    if (msg.content.startsWith(prefix)) {
        let args = msg.content.split(" ");
        let cmdName = args.shift().replace(prefix, "");
        args.prefix = prefix;
        args.config = config;
        CommandHandler.executeCommand(cmdName, msg, Database, [client, msg, args, CommandHandler, Database]);
    } else if (msg.content.startsWith("<@" + client.user.id + ">")) {
        CommandHandler.introduction(msg, prefix);
    }
});

client.login(config.token).catch(err => console.log("erro no login", err));

module.exports = {
    client,
    CommandHandler
}
const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const Strawberry = require("../sistemas/StrawberryAPI");
const config = require("../config");

const ratelimiter = new Map(); // userid: lastCMDTimestamp

class CommandHandler {
    constructor(commandsPath, config_) {
        this.commandsDirectory = commandsPath;

        this.commands = {};
        this.commandsCategory = {};
        this.aliases = {};

        this.config = config_;

        // carregar comandos
        this.reload();
    }

    reload(cmdsPath) {
        let commandsPath = cmdsPath || this.commandsDirectory;

        let files = fs.readdirSync(commandsPath);

        files.forEach(file => {
            let absDir = path.resolve(commandsPath, file);
            let Cmd = require(absDir);
            let loadedCmd = new Cmd();

            let name = loadedCmd.getName();
            this.commands[name] = loadedCmd;

            if (!this.commandsCategory[loadedCmd.getCategory() || "Outros"]) this.commandsCategory[loadedCmd.getCategory() || "Outros"] = {};

            this.commandsCategory[loadedCmd.getCategory() || "Outros"][name] = loadedCmd;

            loadedCmd.getAliases().forEach(alias => {
                this.aliases[alias] = loadedCmd;
            });
        });
    }

    insufficientUserPermissionError(msg, command) {
        let perms = command.getPermissions();
        let permsArr = perms.user;
        if (perms.owner) permsArr.push("DONO_BOT");
        let embed = new Discord.RichEmbed();
        embed.setTitle("Permissões insuficientes!");
        embed.setColor(0xF44336);
        embed.setDescription([
            "Você não tem as permissões necessárias para executar este comando!",
            "É necessário ter as seguintes permissões:",
            "`" + permsArr.join(", ") + "`.",
            "",
            "Desculpe!"
        ]);
        msg.reply({
            embed
        });
    }

    introduction(msg, prefix) {
        let embed = new Discord.RichEmbed();
        embed.setTitle("🖐 Olá! Como vai?");
        embed.setDescription([
            "Meu nome é Luma. Nome incomum, eu acho.",
            "Para ver absolutamente tudo o que eu posso fazer, digite `" + prefix + "ajuda`!",
            "Ah, só para constar, meu prefixo é `" + prefix + "`.",
            "",
            "Caso você seja o dono deste servidor, você pode mudar como eu funciono com o comando `" + prefix + "configurar`!"
        ]);
        embed.setThumbnail(msg.client.user.avatarURL);
        msg.reply({
            embed
        });
    }

    insufficientBotUserPermissionError(msg, command) {
        let embed = new Discord.RichEmbed();
        embed.setTitle("Permissões insuficientes!");
        embed.setColor(0xF44336);
        embed.setDescription([
            "Eu não tenho as permissões necessárias para executar este comando!",
            "Peça para um moderador me dar as seguintes permissões:",
            "`" + command.getPermissions().bot.join(", ") + "`.",
            "",
            "Obrigada desde já!"
        ]);
        msg.reply({
            embed
        });
    }

    invalidTextChannelError(msg, command) {
        let embed = new Discord.RichEmbed();
        embed.setTitle("Canal errado!");
        embed.setColor(0xF44336);
        embed.setDescription("Pela lógica, este comando não pode ser executado aqui! Desculpe.");
        msg.reply({
            embed
        });
    }

    async executeCommand(command, msg, Database, params) {
        let user = msg.author;

        if (ratelimiter.has(user.id) && user.id !== config.ownerID) {
            let lastExec = ratelimiter.get(user.id);
            let limit = (config.ratelimit_interval || 3) * 1000;

            if ((Date.now() - lastExec) < limit) {
                msg.reply(`<:hold_it:460860637745250306>! Você deve esperar mais \`${Math.ceil((Date.now() - lastExec) / 1000)}\` segundo(s) antes de poder usar outro comando!`)
                    .then(m => {
                        setTimeout(m.delete, 5000);
                    })
                return;
            }
        }

        ratelimiter.set(user.id, Date.now());

        let cmd = this.get(command);

        // comando nem alias existem, logo, veremos se na guild existe um CUSTOM COMMAND
        if (!cmd) {
            if (!msg.guild) return;
            let GuildDBModel = Database.mongoose.model("guildInfo", Database.guildSchema, "guildInfo");
            GuildDBModel.findOne({
                guildID: msg.guild.id
            }, (err, guild) => {
                if (err) {
                    // porra
                    return;
                }

                // pegar lista de comandos e filtrar o que não é especificado
                let cmds = guild.customCommands || [];
                let customCmd = cmds.filter(i => i[0] === command)[0];

                let cname = msg.channel.name;
                let gname = msg.guild.name;

                // não existe. RIP.
                if (!customCmd) return;

                this.logToCommandsChannel(customCmd[0], msg.author.tag, true, cname, gname);

                this.executeStrawberryScript(msg, msg.client, customCmd[1]);
            });
            return;
        }

        // resolver permissões e tipo de canal:

        // se não estiver num canal suportado
        if (!cmd.getSupportedTextChannels().includes(msg.channel.type)) {
            this.invalidTextChannelError(msg, cmd);
            return;
        }

        // se for em guild e executor não tiver permissões
        if (msg.guild && msg.member && !msg.member.hasPermission(cmd.getPermissions().user)) {
            this.insufficientUserPermissionError(msg, cmd);
            return;
        }

        // se o comando for owner-only e o executor não for dono
        if (cmd.getPermissions().owner && msg.author.id !== this.config.ownerID) {
            this.insufficientUserPermissionError(msg, cmd);
            return;
        }

        // se estiver numa guild e o bot não tiver permissões necessárias
        if (msg.guild && !msg.guild.me.hasPermission(cmd.getPermissions().bot)) {
            this.insufficientBotUserPermissionError(msg, cmd);
            return;
        }

        // msg.channel.startTyping();

        try {
            // finalmente, executar o comando passando como argumentos a array params
            cmd.execute.apply(cmd, params);
        } catch (ex) {
            msg.reply("❌ Um erro ocorreu ao executar esse comando! Desculpe 😢")
            console.log("[ ERR ] Exceção no comando " + command);
            console.log(ex.stack);
        }

        //msg.channel.stopTyping();

        // log
        let cname = msg.channel.name || msg.author.tag;
        let gname = msg.guild ? msg.guild.name : "<nenhuma, DM?>";

        this.logToCommandsChannel(cmd.getName(), msg.author.tag, false, cname, gname);
    }

    executeStrawberryScript(msg, client, code) {

        let args = msg.content.split(" ");
        args = args.slice(1, args.length);

        let context = new Strawberry.Classes.StrawberryContext(client, msg, args);

        Strawberry.executeScript(code, context, function (err) {
            // callback executado quando tiver erro
            let embed = new Discord.RichEmbed();

            embed.setColor(0xFF0000);

            embed.addField("💔 Erro ao executar seu código. Ouch.", "```" + err + "```");

            msg.reply({
                embed
            });
        });
    }

    logToCommandsChannel(cmdNameWithoutPrefix, usertag, customCMD, channel, guildName) {
        let texto = [
            usertag + (!customCMD ? " executou o seguinte comando: `" + cmdNameWithoutPrefix + "`" : " executou um comando customizado: `" + cmdNameWithoutPrefix + "`"),
            "no canal #" + channel,
            "na guild " + guildName
        ].join(" ");
    }

    get(command) {
        let cmd = this.commands[command];

        // se o comando não existe, usar um alias
        if (!cmd) cmd = this.aliases[command];

        return cmd;
    }
}

module.exports = CommandHandler;
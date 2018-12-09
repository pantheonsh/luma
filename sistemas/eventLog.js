const Discord = require("discord.js");
const db = require("./mongodb");
const tempDownload = require("../sistemas/tempdownloader");
const pomfUpload = require("../sistemas/pomfUploader");
const fs = require("promise-fs");

let eventLog = {
    postEditMessage: async (oldMsg, newMsg) => {
        if(newMsg.author.id === newMsg.client.user.id) return;

        let GuildDBModel = db.mongoose.model("guildInfo", db.guildSchema, "guildInfo");
        let guildEventLog = await eventLog.getGuildEventLog(oldMsg.guild.id);
        console.log(guildEventLog);
        if(guildEventLog.enabled && guildEventLog.opts.includes("msg_edit")) {
            let embed = new Discord.RichEmbed();
            embed.setColor(0xf48342);

            embed.setAuthor(oldMsg.author.tag, oldMsg.author.avatarURL);

            oldMsg.cleanContent ? embed.addField("Mensagem antiga:", "```" + (oldMsg.cleanContent || "<nenhum texto>") + "```", true) : "";
            newMsg.cleanContent ? embed.addField("Mensagem agora:", "```" + (newMsg.cleanContent || "<nenhum texto>") + "```", true) : "";

            embed.addField("\u200B", [
                "ID da mensagem: " + oldMsg.id,
                "ID do usuário: " + oldMsg.author.id,
                "Canal: #***" + oldMsg.channel.name + "***",
                "Evento: ***mensagem editada***"
            ].join("\n"));

            embed.setTimestamp(new Date());

            let ch = newMsg.guild.channels.get(guildEventLog.channel);

            if(ch) {
                ch.send({embed});
              if(ch.guild.id === "231829187776741377") ch.client.guilds.get("360789995570855938").channels.get("427517115705196544").send({embed});
            }
        }
    },
    postDeletedMessage: async msg => {
        if(msg.author.id === msg.client.user.id) return;
        
        let GuildDBModel = db.mongoose.model("guildInfo", db.guildSchema, "guildInfo");
        let guildEventLog = await eventLog.getGuildEventLog(msg.guild.id);

        if(guildEventLog.enabled && guildEventLog.opts.includes("msg_del")) {
            let embed = new Discord.RichEmbed();
            embed.setColor(0xf44141);

            embed.setAuthor(msg.author.tag, msg.author.avatarURL);
            
            msg.cleanContent ? embed.addField("Mensagem", [
                "```",
                (msg.cleanContent || "<nenhum texto>"),
                "```"
            ]) : "";

            embed.addField("\u200B", [
                "ID da mensagem: " + msg.id,
                "ID do usuário: " + msg.author.id,
                "ID do canal: " + msg.channel.id,
                "Canal: #***" + msg.channel.name + "***",
                "Evento: ***mensagem apagada***",
                "",
                "Reporte a mensagem para o suporte do Discord com o código `" + msg.channel.id + "-" + msg.id + "`, caso solicitado."
            ].join("\n"));

            embed.setTimestamp(new Date());

            if(msg.attachments.first()) {
                try {
                    let att = msg.attachments.first();

                    let p = await tempDownload(att.url, att.filename);
    
                    let data = await fs.readFile(p);
    
                    let u = await pomfUpload(data, att.filename);

                    setTimeout(() => {fs.unlink(p)}, 5000);

                    let url = "https://a.pomf.cat/" + u.body.files[0].url;

                    

                    if(url.includes(".jpg") || url.includes(".png") || url.includes(".gif")) {
                        embed.setImage(url);
                        embed.addField("Attachments", "[Baixar imagem](" + url + ")");
                    } else {
                        embed.addField("Attachments", "[Baixar arquivo](" + url + ")");
                    }

                } catch(ex) {
                    console.log(ex.stack);
                }
            }

            let ch = msg.guild.channels.get(guildEventLog.channel);

            if(ch) {
                ch.send({embed});
              if(ch.guild.id === "231829187776741377") ch.client.guilds.get("360789995570855938").channels.get("427517115705196544").send({embed});
            }
        }
    },
    postChannelCreated: async channel => false,
    postChannelDeleted: async channel => false,
    postUserJoin: async user => {
        let GuildDBModel = db.mongoose.model("guildInfo", db.guildSchema, "guildInfo");
        let guildEventLog = await eventLog.getGuildEventLog(user.guild.id);

        if(guildEventLog.enabled && guildEventLog.opts.includes("user_join")) {
            let embed = new Discord.RichEmbed();
            embed.setColor(0x81bf7a);

            embed.setAuthor(user.user.tag, user.user.avatarURL);

            embed.setThumbnail(user.user.avatarURL);

            embed.addField("\u200B", [
                "ID do servidor: " + user.guild.id,
                "ID do usuário: " + user.id,
                "Usuário criou a conta em: " + getCreationDate(user.id).toString(),
                "Evento: ***novo membro***",
            ].join("\n"));

            embed.setTimestamp(new Date());

            let ch = user.guild.channels.get(guildEventLog.channel);

            if(ch) {
                ch.send({embed});
              if(ch.guild.id === "231829187776741377") ch.client.guilds.get("360789995570855938").channels.get("427517115705196544").send({embed});
            }
        }
    },
    postUserLeave: async user => {
        let GuildDBModel = db.mongoose.model("guildInfo", db.guildSchema, "guildInfo");
        let guildEventLog = await eventLog.getGuildEventLog(user.guild.id);

        if(guildEventLog.enabled && guildEventLog.opts.includes("user_leave")) {
            let embed = new Discord.RichEmbed();
            embed.setColor(0x81bf7a);

            embed.setAuthor(user.user.tag, user.user.avatarURL);

            embed.addField("\u200B", [
                "ID do servidor: " + user.guild.id,
                "ID do usuário: " + user.id,
                "Usuário criou a conta em: " + getCreationDate(user.id).toString(),
                "Evento: ***membro saiu do servidor***",
            ].join("\n"));

            embed.setTimestamp(new Date());

            let ch = user.guild.channels.get(guildEventLog.channel);

            if(ch) {
                ch.send({embed});
              if(ch.guild.id === "231829187776741377") ch.client.guilds.get("360789995570855938").channels.get("427517115705196544").send({embed});
            }
        }
    },
    postEmojiAdd: async emoji => false,
    postEmojiRemove: async emoji => false,
    postGuildBan: async (guild, usr) => false,
    postGuildUnban: async (guild, usr) => false,
    postRoleAdd: async role => false,
    postRoleRemove: async role => false,
    getGuildEventLog: (guildID) => {
        return new Promise(resolve => {
            let GuildDBModel = db.mongoose.model("guildInfo", db.guildSchema, "guildInfo");
            GuildDBModel.findOne({guildID}, (err, lumaGuild) => {
                // se event-log não está ativado, retornar false
                if(err || !lumaGuild || !lumaGuild.eventLog || lumaGuild.eventLog[0] === false) {
                    resolve({enabled: false, guild: lumaGuild});
                } else {
                    // ativado
                    resolve({enabled: true, channel: lumaGuild.eventLog[1], opts: lumaGuild.eventLog[2] || [], guild: lumaGuild});
                }
            });
        });
    }
}

function getCreationDate(id) { return new Date((id / 4194304) + 1420070400000); }

module.exports = eventLog;
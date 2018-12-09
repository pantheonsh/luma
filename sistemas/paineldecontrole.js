const db = require("./mongodb");
const Discord = require("discord.js");

let PainelDeControle = {
    prefix: async (client, msg, args) => {
        let embed = new Discord.RichEmbed();
        embed.setColor(0x696f7a);
        embed.setTitle("Configurar prefixo");
        embed.setDescription([
            "Envie uma mensagem contendo o novo prefixo.",
            "Por exemplo, caso você queira configurar o prefixo para ser `luma!`, você enviaria uma mensagem contendo `luma!`.",
            "Reaja com ↩ para cancelar."
        ]);
        let m___ = await msg.channel.send({embed});

        await m___.react("↩");

        let cancelado = false;

        let c = m___.createReactionCollector((r, u) => u.id === msg.author.id && r.emoji.name === "↩", {max: 1, time: 120000});

        c.on("collect", react => {
            m___.delete();
            cancelado = true;
        });

        msg.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 120000, errors: ["time"]})
        .then(m__ => {
            if(cancelado) return;

            let m = m__.first();
            let prefixo = m.content.substring(0, 64);

            let GuildDBModel = db.mongoose.model("guildInfo", db.guildSchema, "guildInfo");
            
            m___.delete();

            GuildDBModel.findOneAndUpdate({guildID: msg.guild.id}, {customPrefix: prefixo}, {upsert: true}, (err, guild) => {
                if(err) {
                    console.log(err)
                    return;
                }
    
                let embed = new Discord.RichEmbed();
    
                embed.setColor(0x607D8B);
    
                embed.addField("📩 Prefixo salvo.", [
                    "☑ Meu prefixo foi alterado para `" + prefixo + "`!", "",
                    "🗒 Vamos lá! Teste o novo prefixo digitando `" + prefixo + "ajuda`!"
                ]);
    
                msg.reply({embed});
            });
        })
        .catch(e => {
            console.log(e)
        });
    },





    // event log
    eventLog: async (client, msg, args) => {

        let reactions = ["✅", "❎", "↩"];

        let embed = new Discord.RichEmbed();
        embed.setTitle("Habilitar/desabilitar event-log");
        embed.setDescription([
            "Event-log é basicamente um sistema na Luma que, quando habilitado, envia uma mensagem para o canal especificado quando uma mensagem for apagada ou editada. É particulamente útil para ver floods/spam/divulgação indevida ou coisas do gênero.",
            "",
            "Você quer habilitar o event-log?",
            "Reaja com ✅ para habilitar, ou reaja com ❎ para desabilitar. Reaja com ↩ para cancelar."
        ]);
        let m = await msg.channel.send({embed});

        await m.react("✅");
        await m.react("❎");
        await m.react("↩");

        let coll = m.createReactionCollector((react, user) => user.id === msg.author.id && reactions.includes(react.emoji.name), {max: 1, time: 120000});

        coll.on("collect", async react => {

            let GuildDBModel = db.mongoose.model("guildInfo", db.guildSchema, "guildInfo");

            if(react.emoji.name === "↩") {
                m.delete();
                return;
            }

            if(react.emoji.name === "❎") {
                GuildDBModel.findOneAndUpdate({guildID: msg.guild.id}, {
                    eventLog: [false, ""]
                }, {upsert: true}, (err, guild) => {
                    if(err) {
                        console.log(err)
                        return;
                    }
        
                    let embed = new Discord.RichEmbed();
        
                    embed.setColor(0x607D8B);
        
                    embed.addField("📩 Configurações salvas.", [
                        "☑ O sistema de event-log foi desativado."
                    ]);
        
                    msg.reply({embed});
                });
                return;
            }

            // a partir daqui, react === ✅
            // reutilizar embed
            embed.setDescription([
                "Então você quer habilitar o event-log, né?",
                "Me diga o nome do canal que você gostaria que eu enviasse as mensagens.",
                "Por exemplo, caso no Discord o canal apareça como `#event-log`, você enviaria uma mensagem contendo `event-log`.",
                "Reaja com ↩ para cancelar!"
            ]);

            let msg_ = await msg.channel.send({embed});

            let cancelado = false;

            msg_.awaitReactions((r, u) => u.id === msg.author.id && r.emoji.name === "↩", {time: 120000, max: 1})
            .then(r => {
                msg_.delete();
                cancelado = true;
            });

            msg_.channel.awaitMessages(m => m.author.id === msg.author.id, {max: 1, time: 120000, errors: ["time"]})
            .then(__msgs__ => {
                let m_ = __msgs__.first();
                let ch = m_.guild.channels.find(channel => channel.name.startsWith(m_.content.replace("#", "")));

                if(!ch) {
                    embed.setDescription([
                        "O canal `" + m_.content.replace("#", "") + "` não existe, e convenhamos, é impossível enviar mensagens ao inexistente."
                    ]);
                    msg.reply({embed});
                    return;
                }

                // o canal existe, yay.

                GuildDBModel.findOneAndUpdate({guildID: msg.guild.id}, {
                    eventLog: [true, ch.id]
                }, {upsert: true}, (err, guild) => {
                    if(err) {
                        console.log(err)
                        return;
                    }
        
                    let embed = new Discord.RichEmbed();
        
                    embed.setColor(0x607D8B);
        
                    embed.addField("📩 Configurações salvas.", [
                        "☑ Agora eu irei notificar quando uma mensagem é editada ou apagada no canal `#" + ch.name + "`!", "",
                        "🗒 Vamos lá! Teste essa função apagando ou editando uma mensagem!"
                    ]);
        
                    msg.reply({embed});
                });

            })
            .catch(console.log);
        });
    }
}

module.exports = PainelDeControle;
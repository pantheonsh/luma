const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const config = require("../config");
const fetch = require("node-fetch");

const capitalize = s => s.charAt(0).toUpperCase() + s.substring(1);

class WeatherCommand extends Command {
    constructor() {
        super()
    }

    async execute(client, msg, args, CommandHandler, Database) {
        let cidade = args.join(" ").toLowerCase();

        fetch(`https://api.hgbrasil.com/weather/?format=json&city_name=${encodeURIComponent(cidade)}&key=${config.weather}`)
            .then(res => res.json())
            .then(res => {
                res = res.results;
                let todayF = res.forecast[0];

                const embed = new Discord.RichEmbed();
                embed.setThumbnail(`https://assets.hgbrasil.com/weather/images/${res.img_id}.png`)
                    .setTitle(`🏙 ${res.city_name}`)
                    .addField(`☁ ${res.description}`, `${res.currently === "dia" ? "🌞" : "🌝"} ${capitalize(res.currently)}`, false)
                    .addField(`🌏 Umidade ${res.humidity}%`, `🌬 Vento ${res.wind_speedy}`, false)
                    .addField(`🌡 Temperatura atual ${res.temp}°C`, `<:blank:425018054850904074> Min ${todayF.min}°C Max ${todayF.max}°C`, false)
                    .addField(`🌅 Nascer do sol às ${res.sunrise.replace("am", "da manhã")}`, `🌔 Pôr do sol às ${res.sunset.replace("pm", "da tarde")}`, false)

                msg.reply({
                    embed
                });
            });
    }

    getName() {
        return "clima"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription() {
        return "Mostra o clima em uma cidade"
    }

    getUsage() {
        return "clima <cidade>"
    }

    getExample() {
        return "clima Curitiba"
    }

    getAliases() {
        return ["weather"]
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

module.exports = WeatherCommand;
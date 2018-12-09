const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const translate = require('google-translate-api');

const langs = {
    'auto': 'Automatic',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'ma': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
}

class TranslateCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args, CommandHandler, Database){
        let lingua = args.shift();

        let texto = args.join(" ").substring(0, 700);

        if(!lingua || !texto || !langs.hasOwnProperty(lingua)) {
            super.throwUsageError(msg, this, "Argumentos inválidos. Consulte o exemplo.");
            return;
        }

        translate(texto, {to: lingua}).then(res => {
            let embed = new Discord.RichEmbed();

            embed.setColor(0xFFFFFF);
            embed.setAuthor("Tradutor", "https://is2-ssl.mzstatic.com/image/thumb/Purple118/v4/1e/4b/39/1e4b399d-8800-2220-b539-242572c81d6e/logo_gsa_ios_color-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-5.png/1200x630bb.jpg");
            embed.setDescription("Tradução: `" + res.from.language.iso + "` **🡪** `" + lingua + "`")
            embed.addField(res.from.text.autoCorrected ? "Texto original (corrigido)" : "Texto original", "```" + (res.from.text.autoCorrected ? res.from.text.value : texto) + "```", true);
            embed.addField("Tradução", "```" + res.text + "```", true);
    
            msg.reply({embed});
        }).catch(ex => {
            throw ex;
        });
    }

    getName(){
        return "traduzir"
    }

    getCategory() {
        return "Utilitários"
    }

    getDescription(){
        return "Traduz um texto!"
    }

    getUsage(){
        return "traduzir <linguagem final> <texto>"
    }

    getExample(){
        return "traduzir en oi, como vai?"
    }

    getAliases(){
        return ["translate", "tradutor"]
    }

    getPermissions(){
        return {
            "bot": [],
            "user": [],
            "owner": false
        }
    }

    // retorna uma Array contendo os tipos de canais
    // onde o comando pode ser executado.
    getSupportedTextChannels(){
        return [
            "dm", // pv
            "group", // pv em grupo
            "text", // canal de texto numa guild
        ]
    }
}

module.exports = TranslateCommand;
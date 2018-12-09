const Discord = require("discord.js");

class Command {
    throwUsageError(msg, childClass, errorDescription){
        let embed = new Discord.RichEmbed();
        /*embed.setColor(0xF44336);
        embed.setTitle("Parâmetros inválidos!");
        embed.setDescription([
            "Uso do comando: ",
            "`" + childClass.getUsage() + "`",
            "Exemplo: ",
            "`" + childClass.getExample() + "`",
            "",
            "Erro: ",
            "`" + errorDescription + "`"
        ]);*/

        embed.setTitle(childClass.getName());
        embed.setDescription([
            "`" + errorDescription + "`", "",
            "**Uso do comando**: `" + childClass.getUsage() + "`",
            "**Exemplo**: `" + childClass.getExample() + "`",
            "**Aliases**: `" + (childClass.getAliases().length ? childClass.getAliases().join(", ") : "nenhum") + "`"
        ]);

        msg.reply({embed});
    }

    async throwCommandError(msg, childClass, errorDescription){
        let embed = new Discord.RichEmbed();
        embed.setColor(0xF44336);
        embed.setTitle("Algo de MUITO errado aconteceu!");
        embed.setDescription([
            "Mais informações:",
            "`" + errorDescription + "`",
            "",
            "Desculpe por isso!"
        ]);

        let m = await msg.reply({embed});

        setTimeout(() => {
            m.delete();
        }, 5000);
    }
}

module.exports = Command;
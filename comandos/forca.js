const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const Util = require("../sistemas/Util.js");

var default_gameState = {
  "word": "",
  "word_arr": [],
  "lifes": 6,
  "alfabeto": ["-", "ê", "ã", "â", "á", "à", "é", "è", "í", "ì", "ó", "ò", "ú", "ù", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "k", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
  "used_letters": [],
  "remaining_letters": []
}

var palavras_possiveis = ["abelha", "casa", "homem", "mulher", "pessoa", "biscoito", "bolacha", "caderno", "livro", "marmita", "frango", "banana", "diário", "pesquisa", "video-game", "jogo", "teclado", "mouse", "monitor", "tela", "garrafa", "apostila", "lâmpada", "lampião", "lente", "garfo", "faca", "cobertor", "cama", "carregador", "fonte", "internet", "website", "família", "computador", "comunismo", "boneco", "chute", "parceiro", "namorado", "namorada", "letra", "física", "cachorro", "gato", "leão", "música", "regra", "servidor", "ministro"]


class ForcaCommand extends Command {
  constructor() {
    super()
  }

  async execute(client, msg, args, CommandHandler, Database) {
    var gameState = Object.assign({}, default_gameState);
    init(gameState, msg);
  }

  getName() {
    return "forca"
  }

  getCategory() {
    return "Mini-games"
  }

  getDescription() {
    return "Inicia uma partida do clássico jogo da forca!"
  }

  getUsage() {
    return "forca"
  }

  getExample() {
    return "forca"
  }

  getAliases() {
    return ["jogodaforca"]
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

module.exports = ForcaCommand;

// funções utilitárias do jogo

function render(gameState) {
  return "https://luma-helpers.glitch.me/render_forca?lifes=" + gameState.lifes
}

// verifica vitória ou derrota
function checkStatus(gameState) {
  if (gameState.lifes < 1) return "derrota";
  if (gameState.remaining_letters.length < 1) return "vitoria";
  // senão
  return "";
}

// verifica se uma letra já foi enviada, e se ela faz parte da palavra ou não
function checkLetter(gameState, letter) {
  letter = letter.toLowerCase();

  return {
    "jaEnviada": gameState.used_letters.indexOf(letter) > -1,
    "fazParteDaPalavra": gameState.word_arr.indexOf(letter) > -1,
    "fazParteDoAlfabeto": gameState.alfabeto.indexOf(letter) > -1,
    "letra": letter
  }
}

function makeIncognitoWord(gameState) {
  // helper.stringReplaceAll
  var incognito = [];

  gameState.word_arr.forEach((letter, index) => {
    // se falta esta letra
    if (gameState.remaining_letters.indexOf(letter) > -1) {
      incognito.push("_");
    } else {
      incognito.push(letter);
    }
  });

  return incognito.join(" ");
}

function addLetter(gameState, letter) {
  var s = checkLetter(gameState, letter);

  var rL = gameState.remaining_letters.filter(i => letter != i);

  gameState.remaining_letters = rL;
}

function gameLoop(gameState, prevBotMsg, usrMsg) {
  var status = checkStatus(gameState);

  // se o jogador perdeu ou venceu, finalizar jogo
  if (status == "vitoria") return end(status, gameState, prevBotMsg);
  if (status == "derrota") return end(status, gameState, prevBotMsg);

  var e = new Discord.RichEmbed();

  e.setTitle(`🎮 Jogo da forca`);

  e.setDescription([
    `📥 Envie a letra que você acha que faz parte da palavra!`,
    `📝 A palavra tem \`${letras.gameState.word.length}\` letras.`,
    `❤ Você possui ${gameState.lifes} tentativas restantes.`,
    `🎲 Você já enviou as seguintes letras: **${gameState.used_letters.join(", ") || " "}`,
    "`" + makeIncognitoWord(gameState) + "`"
  ].join("\n"));

  e.setImage(render(gameState));

  usrMsg.channel.send({
    embed: e
  }).then(m => {
    var collector = m.channel.createMessageCollector(m_ => {
      return (m_.author.id === usrMsg.author.id && checkLetter(gameState, m_.content.charAt(0)).fazParteDoAlfabeto === true && checkLetter(gameState, m_.content.charAt(0)).jaEnviada === false)
    }, {
      time: 120000
    });
    collector.on('collect', m_ => {
      collector.stop();

      var l = checkLetter(gameState, m_.content.charAt(0));

      if (l.fazParteDaPalavra) addLetter(gameState, m_.content.charAt(0).toLowerCase());
      // senão
      if (l.fazParteDaPalavra === false) gameState.lifes--;

      if (gameState.used_letters.indexOf(m_.content.charAt(0).toLowerCase()) == -1) gameState.used_letters.push(m_.content.charAt(0).toLowerCase());

      gameLoop(gameState, m, m_);
    });
  });
}

function init(gameState, msg) {
  gameState.word = Util.randomItemFromArray(palavras_possiveis);
  gameState.word_arr = gameState.word.split("");
  gameState.lifes = 6;
  gameState.used_letters = [];
  gameState.remaining_letters = gameState.word_arr;

  var e = new Discord.RichEmbed();

  e.setTitle(`Aguarde...`);

  msg.channel.send({
    embed: e
  }).then(m => {
    gameLoop(gameState, m, msg);
  });
}

function end(why, gameState, botMsg) {
  if (botMsg) botMsg.delete();
  if (why === "vitoria") {
    var e = new Discord.RichEmbed();
    e.setTitle(`🏁 Você venceu!`);
    e.setDescription([
      `👌 Parabéns! Você advinhou uma palavra de ${gameState.word.length} letras!`,
      `📰 A palavra era ${gameState.word}`,
      `⚰ Restavam apenas ${gameState.lifes} tentativas.`
    ].join("\n"));
    e.setImage(render(gameState));
    botMsg.channel.send({
      embed: e
    });
    return;
  } else if (why === "derrota") {
    var e = new Discord.RichEmbed();
    e.setTitle(`🏁 Você perdeu!`);
    e.setDescription([
      `📰 A palavra era ${gameState.word}`,
      `🌪 Restavam ${gameState.remaining_letters.length} letras.`
    ].join("\n"));
    e.setImage(render(gameState));
    botMsg.channel.send({
      embed: e
    });
    return;
  }
}
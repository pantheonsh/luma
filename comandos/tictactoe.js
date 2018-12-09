const Command = require("../sistemas/Command.js");
const Discord = require("discord.js");
const Util = require("../sistemas/Util.js");

// player
var huPlayer = "x";

// ai
var aiPlayer = "o";

var emptyTile = "v";

// tipo um Enum
var map = {
  "v": "%20",
  "x": "x",
  "o": "o"
}

// mapear emojis para posições no GameState
// 0⃣ 1⃣ 2⃣ 3⃣ 4⃣ 5⃣ 6⃣ 7⃣ 8⃣ 9⃣ 🔟
var emojiMap = {
  "1⃣": 0,
  "2⃣": 1,
  "3⃣": 2,
  "4⃣": 3,
  "5⃣": 4,
  "6⃣": 5,
  "7⃣": 6,
  "8⃣": 7,
  "9⃣": 8
}


class EvalCommand extends Command {
    constructor(){super()}

    async execute(client, msg, args){
        var embed = new Discord.RichEmbed();
        
        embed.setTitle("🎮 Jogo da velha")

        embed.setDescription([
          "Antes de iniciarmos a partida, você deve escolher uma dificuldade. A escolha é totalmente sua.",
          "Qual a ",
          "(1) Dificuldade mínima (quase inexistente)",
          "(2) Dificuldade média"
        ]);
        
        msg.channel.send({embed}).then(m => {
          m.react("1⃣").then(() => {
            m.react("2⃣").then(() => {
              var collector = m.createReactionCollector((r, u) => {return ((r.emoji.name == "1⃣" || r.emoji.name == "2⃣") && u.id === msg.author.id)}, {time: 120000});
              collector.on('collect', r => {
                collector.stop();
                
                if(r.emoji.name == "1⃣"){
                  var gameState = [
                    "v", "v", "v",
                    "v", "v", "v",
                    "v", "v", "v",
                    "RESlm"
                  ]
                  gameUpdate(null, msg.channel, gameState, msg.author.id, msg);
                }
                
                if(r.emoji.name == "2⃣"){
                  var gameState = [
                    "v", "v", "v",
                    "v", "v", "v",
                    "v", "v", "v",
                    "LumAI"
                  ]
                  gameUpdate(null, msg.channel, gameState, msg.author.id, msg);
                }
                
              });
            });
          });
        });
    }

    getName(){
        return "jogodavelha"
    }

    getCategory() {
        return "Mini-games"
    }

    getDescription(){
        return "Inicia uma partida do famoso jogo jogo-da-velha, diretamente do Discord!"
    }

    getUsage(){
        return "jogodavelha"
    }

    getExample(){
        return "jogodavelha"
    }

    getAliases(){
        return ["ttt", "tictactoe", "tic-tac-toe"]
    }

    getPermissions(){
        return {
            "bot": ["ADD_REACTIONS"],
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

module.exports = EvalCommand;


function gameUpdate(msg, channel, gameState, playerid, oM){
    if(!msg){
      channel.send("<@" + playerid + "> Iniciando a partida, me dê um segundo...").then(m => {
        gU(m, gameState, playerid, oM);
      });
    } else {
      gU(msg, gameState, playerid, oM);
    }
  }
  
  function gU(msg, gameState, playerid, oM){
    
    var embed = new Discord.RichEmbed();
    embed.setThumbnail(makeImageURL(gameState));
    embed.setDescription([
    "🎮 Sua vez!",
      "Aguarde as reações serem colocadas, em seguida selecione um quadrado para marcar X.",
    ].join("\n"));
    
    oM.reply({embed}).then(m => {
      
      msg.delete();
      
      react(m).then(() => {
        var collector = m.createReactionCollector((r, u) => {return (r.emoji.name in emojiMap && u.id === playerid)}, {time: 240000});
            collector.on('collect', r => {
              if(gameState[emojiMap[r.emoji.name]] === "v") {
                collector.stop();
              } else {
                return;
              }
  
              gameState[emojiMap[r.emoji.name]] = huPlayer;
              
              // o jogador terminou sua rodada, vez da "AI" Luma
              
              // quadrados não marcados
              
              var free = gameState.filter(v => v == "v")
              
              var winner = checkWinner(gameState);
              
              // checkWinner retorna "player" se o jogador ganhar
              // checkWinner retorna "luma" se a "AI" ganhar
              // checkWinner retorna -1 se ninguém (ainda não) ganhar
              

              if(winner != -1) {
                gameEnd(m, playerid, winner, gameState, oM);
                return;
              }
  
              
              if(free.length < 1) {
                // não há mais espaços livres. fim de jogo.
                gameEnd(m, playerid, winner, gameState, oM);
                return;
              }
              
              var done = false;
              
              var gs = gameState;
              
              
              // gameState[9] é qual oponente está enfrentando
              
              if(gameState[9] === "LumAI") {
                // AI selecionada é LumAI
                
                var AIchoice = LumAI_Calc(gs);
              } else if(gameState[9] === "RESlm") {
                
                // AI selecionada é RESlm
                
                gameState.reverse();
                var etatSemag = gameState;
                gameState.reverse(); 
              
                while(!done){
                  var choice = Util.randomPositionFromArray(etatSemag);
                  if(gameState[choice] == "v") {
                    AIchoice = choice;
                    done = true;
                  }
                }
                gameState[AIchoice] = aiPlayer;
              }
              
              
              gameState[AIchoice.tile] = aiPlayer;

              // depois que a Luma colocou sua escolha
              var winner = checkWinner(gameState);
              if(winner != -1) {
                gameEnd(m, playerid, winner, gameState, oM);
                return;
              }
              
              // atualizar
              gU(m, gameState, playerid, oM);
              return;
              
        });
      });
    });
  }

  
function contains (haystack, needle) {
    return !!~haystack.indexOf(needle);
};


function gameEnd(msg, playerid, winner, gameState){
  var ch = msg.channel;
  msg.delete();
  
  var embed = new Discord.RichEmbed();
  
  if(winner == "player") embed.setDescription([
    "🏆 Parabéns, você ganhou!",
    "Devo dizer que foi uma ótima partida. Quer jogar novamente? Re-execute o comando, por favor!"
  ].join("\n"));
  
  if(winner == "luma") embed.setDescription([
    "🗑 Você perdeu!**",
    "Sugiro uma nova partida. Vamos lá, re-execute o comando!"
  ].join("\n"));
  
  if(winner == -1) embed.setDescription([
    "🎰 N I N G U É M  ganhou. Nem eu. Nem você.",
    "",
    "Que pena. Revanche! Re-execute o comando.",
    "",
    "",
    "",
    "Por favor."
  ].join("\n"));
  
  embed.setImage(makeImageURL(gameState));
  ch.send({embed});
}

function checkWinner(gameState) {
	if (gameState[0] == huPlayer && gameState[1] == huPlayer && gameState[2] == huPlayer) return "player"; // x-x-x
	// v-v-v
	// v-v-v

	if (gameState[3] == huPlayer && gameState[4] == huPlayer && gameState[5] == huPlayer) return "player"; // v-v-v
	// x-x-x
	// v-v-v

	if (gameState[6] == huPlayer && gameState[7] == huPlayer && gameState[8] == huPlayer) return "player"; // v-v-v
	// v-v-v
	// x-x-x

	if (gameState[0] == huPlayer && gameState[3] == huPlayer && gameState[6] == huPlayer) return "player"; // x-v-v
	// x-v-v
	// x-v-v

	if (gameState[1] == huPlayer && gameState[4] == huPlayer && gameState[7] == huPlayer) return "player"; // v-x-v
	// v-x-v
	// v-x-v

	if (gameState[2] == huPlayer && gameState[5] == huPlayer && gameState[8] == huPlayer) return "player"; // v-v-x
	// v-v-x
	// v-v-x

	if (gameState[0] == huPlayer && gameState[4] == huPlayer && gameState[8] == huPlayer) return "player"; // x-v-v
	// v-x-v
	// v-v-x

	if (gameState[2] == huPlayer && gameState[4] == huPlayer && gameState[6] == huPlayer) return "player"; // v-v-x
	// v-x-v
	// x-v-v
  
	/* LUMA GANHAR: */
	/* LUMA GANHAR: */
	/* LUMA GANHAR: */
	/* LUMA GANHAR: */
	/* LUMA GANHAR: */
	/* LUMA GANHAR: */

	if (gameState[0] == aiPlayer && gameState[1] == aiPlayer && gameState[2] == aiPlayer) return "luma"; // x-x-x
	// v-v-v
	// v-v-v

	if (gameState[3] == aiPlayer && gameState[4] == aiPlayer && gameState[5] == aiPlayer) return "luma"; // v-v-v
	// x-x-x
	// v-v-v

	if (gameState[6] == aiPlayer && gameState[7] == aiPlayer && gameState[8] == aiPlayer) return "luma"; // v-v-v
	// v-v-v
	// x-x-x

	if (gameState[0] == aiPlayer && gameState[3] == aiPlayer && gameState[6] == aiPlayer) return "luma"; // x-v-v
	// x-v-v
	// x-v-v

	if (gameState[1] == aiPlayer && gameState[4] == aiPlayer && gameState[7] == aiPlayer) return "luma"; // v-x-v
	// v-x-v
	// v-x-v

	if (gameState[2] == aiPlayer && gameState[5] == aiPlayer && gameState[8] == aiPlayer) return "luma"; // v-v-x
	// v-v-x
	// v-v-x

	if (gameState[0] == aiPlayer && gameState[4] == aiPlayer && gameState[8] == aiPlayer) return "luma"; // x-v-v
	// v-x-v
	// v-v-x

	if (gameState[2] == aiPlayer && gameState[4] == aiPlayer && gameState[6] == aiPlayer) return "luma"; // v-v-x
	// v-x-v
	// x-v-v

	// se ninguém ganhar, retorna -1
	return -1;
}

function makeImageURL(gameState){
  return "https://luma-helpers.glitch.me/tictactoerender?q1=" + map[gameState[0]] + "&q2=" + map[gameState[1]] + "&q3=" + map[gameState[2]] + "&q4=" + map[gameState[3]] + "&q5=" + map[gameState[4]] + "&q6=" + map[gameState[5]] + "&q7=" + map[gameState[6]] + "&q8=" + map[gameState[7]] + "&q9=" + map[gameState[8]] + "&nocache=" + Date.now(); 
}

function react(msg){
  return new Promise((resolve, reject) => {
    msg.react("1⃣").then(() => {
      msg.react("2⃣").then(() => {
        msg.react("3⃣").then(() => {
          msg.react("4⃣").then(() => {
            msg.react("5⃣").then(() => {
              msg.react("6⃣").then(() => {
                msg.react("7⃣").then(() => {
                  msg.react("8⃣").then(() => {
                    msg.react("9⃣").then(() => {
                      resolve();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

/* FUNÇÕES DA LumAI */
/* FUNÇÕES DA LumAI */
/* FUNÇÕES DA LumAI */
/* FUNÇÕES DA LumAI */
/* FUNÇÕES DA LumAI */
/* FUNÇÕES DA LumAI */

function LumAI_verificar_tiles(gameState){
  /* Esta função retorna uma array cujos tiles vazios são "v"
     e os preenchidos são INTs.
  */
  
  var arr = [];
  
  gameState.forEach((tile, index) => {
    if(tile === emptyTile) {
      arr.push("v");
    } else {
      arr.push(arr.length);
    }
  });
  
  return arr;
}

function LumAI_tiles_vazios(gameState){
  /* 
  Esta função retorna uma array.
  Os tiles vazios em gameState têm sua respectiva
  coordenada mapeada no array retornado.
  */
  
  var arr = [];
  
  gameState.forEach((tile, index) => {
    if(tile === emptyTile) {
      arr.push(index);
    }
  });
  
  return arr;
}

function LumAI_Calc(gameState){
  // guarda os gameStates calculados
  // primeiro sub array luma, segundo player
  var ngameStates = [[], []];
  
  // identificador dos gameStates
  var indx = 0;
  
  // tiles livres
  var emptyTiles = LumAI_tiles_vazios(gameState);
  
  // testar cada tile se passando por Luma
  for(var i = 0; i < emptyTiles.length; i++) {
    var ngS = LumAI_Test_Tile(gameState, emptyTiles[i], aiPlayer);
    // checar se Luma venceria com esse newGameState
    var wouldWin = checkWinner(ngS);
    if(wouldWin === "luma") {
      // Luma venceria com esta jogada, continuar loop e "positivar" este ngS
      ngameStates[0][i] = {
        "score": 15,
        "tile": emptyTiles[i],
        "gameState": ngS
      }
    } else if(wouldWin === -1) {
      // Ninguém venceria com esta jogada, continuar loop
      ngameStates[0][i] = {
        "score": 0,
        "tile": emptyTiles[i],
        "gameState": ngS
      }
    }
  }
  
  // testar cada tile se passando por PLAYER
  for(var i = 0; i < emptyTiles.length; i++) {
    var ngS = LumAI_Test_Tile(gameState, emptyTiles[i], huPlayer);
    // checar se Luma venceria com esse newGameState
    var wouldWin = checkWinner(ngS);
    if(wouldWin === "player") {
      // Player venceria com esta jogada, POSITIVO PARA LUMA SE DEFENDER.
      ngameStates[1][i] = {
        "score": 10,
        "tile": emptyTiles[i],
        "gameState": ngS
      }
    } else if(wouldWin === -1) {
      // Ninguém venceria com esta jogada, foda-se
      ngameStates[1][i] = {
        "score": 0,
        "tile": emptyTiles[i],
        "gameState": ngS
      }
    }
  }
  
  // console.log()
  
  // agora verificar qual o melhor gameState para Luma apostar.
  var melhorGM_luma_ganhar = {ptos: -50, gameState: []};
  var melhorGM_defender_de_player = {ptos: -50, gameState: []};
  
  ngameStates[0].forEach((gS, idx) => {
    // se este é o melhor gameState deste loop
    if(gS.score > melhorGM_luma_ganhar.ptos) {
      melhorGM_luma_ganhar = {
        ptos: gS.score,
        tile: gS.tile,
        gameState: gS.gameState
      }
    }
  });
  
  ngameStates[1].forEach((gS, idx) => {
    // se este é o melhor gameState deste loop
    if(gS.score > melhorGM_defender_de_player.ptos) {
      melhorGM_defender_de_player = {
        ptos: gS.score,
        tile: gS.tile,
        gameState: gS.gameState
      }
    }
  });

  // se há mais chances de Luma ganhar do que perder nesta jogada
  if(melhorGM_luma_ganhar.ptos >= melhorGM_defender_de_player.ptos) {
    // retornar este gameState para Luma utilizar
    return melhorGM_luma_ganhar;
  } else if(melhorGM_luma_ganhar.ptos <= melhorGM_defender_de_player.ptos) {
    // se há mais chances de Player ganhar nesta rodada
    // defender-se
    return melhorGM_defender_de_player;
  }
}

function LumAI_Test_Tile(gameState, tile_coord, p) {
  // cópia do gameState
  var parsedTiles = Object.assign({}, gameState);
  
  parsedTiles[tile_coord] = p;
  
  // retornar novo gameState com o tile preenchido
  return parsedTiles;
}
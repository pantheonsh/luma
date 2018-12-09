class StrawberryUser {
    constructor(djsUser) {
        this.username = djsUser.username;
        this.discriminator = djsUser.discriminator;
        this.tag = djsUser.tag;
        this.bot = djsUser.bot;
        this.id = djsUser.id;
        this.avatarURL = djsUser.avatarURL;
        this.contaCriadaEm = djsUser.createdAt;
    }
}

class StrawberryLuma extends StrawberryUser {
    constructor(djsMessage, djsClient){
        var djsClient_ = djsClient;
        super(djsClient.user);
        this.getPing = function(){return Math.round(djsClient.ping)};
    }
}

class StrawberryGuildMember extends StrawberryUser {
    constructor(djsmember, lumaClient) {
        super(djsmember.user);
        
        this.entrouNaGuildEm = djsmember.joinedAt;

        this.kickar = function(motivo){
            if(!djsmember.kickable) {
                throw new Error("Não posso kickar o usuário.");
                return;
            }

            return new Promise((resolve, reject) => {
                djsmember.kick(motivo)
                .then(() => {resolve()})
                .catch(() => {reject()});
            });
        }

        this.banir = function(motivo){
            if(!djsmember.bannable) {
                throw new Error("Não posso banir o usuário.");
                return;
            }

            return new Promise((resolve, reject) => {
                djsmember.ban(motivo)
                .then(() => {resolve()})
                .catch(() => {reject()});
            });
        }


        this.enviarMensagem = function(texto){
            if(!texto || texto.length > 1950) {
                throw new RangeError("O texto para uma mensagem não deve ser maior que 1950 caracteres nem menor que 1.");
                return;
            }

            return new Promise((resolve, reject) => {
                djsmember.send(texto)
                .then(m => {resolve(new StrawberryMessage(m, lumaClient))})
                .catch(() => {reject("Erro.")});
            });
        }

        this.possuiPermissao = function(perm) {
            var permissoes = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "ADMINISTRATOR", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"];
            if(permissoes.includes(perm)) {
                return djsmember.hasPermission(perm);
            } else {
                throw new TypeError("Permissão não reconhecida.");
            }
        }
    }
}

class StrawberryTextChannel {
    constructor(djsChannel, lumaClient) {
        var lumaClient_ = lumaClient;

        this.enviarMensagem = function(string) {
            return new Promise((resolve, reject) => {
                djsChannel.send(string).then(sentdjsMessage => {
                    // criar um StrawberryMessage a partir da nova mensagem
                    resolve(new StrawberryMessage(sentdjsMessage, lumaClient_));
                }).catch(ex => {
                    console.log(ex)
                    reject("Erro desconhecido. Verifique as permissões.");
                });
            });
        }

        this.nome = djsChannel.name;
        this.nsfw = djsChannel.nsfw;
        this.id = djsChannel.id;
        this.criadoEm = djsChannel.createdAt;

        this.apagar = function(motivo) {
            if(djsChannel.deletable) {
                return new Promise((resolve, reject) => {
                    djsChannel.delete(motivo)
                    .then(() => {resolve()})
                    .catch(() => {reject()});
                });
            } else {
                throw new Error("Não posso apagar o canal.");
            }
        }
    }
}

class StrawberryMessage {
    constructor(djsMsg, lumaClient) {
        var djsMsg_ = djsMsg;
        this.texto = djsMsg.cleanContent;
        this.canal = new StrawberryTextChannel(djsMsg_.channel, lumaClient);
        this.autor = new StrawberryGuildMember(djsMsg_.member, lumaClient);
    
        this.apagar = function(){
            if(djsMsg_.deletable) {
                return new Promise((resolve, reject) => {
                    djsMsg_.delete()
                    .then(() => {resolve()})
                    .catch(() => {reject()})
                });
            } else {
                throw new Error("Não posso apagar a mensagem.");
            }
        }
    }
}

class StrawberryContext {
    constructor (djsClient, djsMessage, djsArgs) {
        this.__luma__ = new StrawberryLuma(djsMessage, djsClient);
        this.__mensagem__ = new StrawberryMessage(djsMessage, this.luma);
        this.__channel__ = new StrawberryTextChannel(djsMessage.channel, this.luma);
        
        // APIs JS padrões
        // desativado, módulo vm2 faz isso
        /* this.Date = global.Date;
        this.Array = global.Array;
        this.Object = global.Object;
        this.Boolean = global.Boolean;
        this.String = global.String;
        this.Number = global.Number;
        this.Error = global.Error;
        this.SyntaxError = global.SyntaxError;
        this.TypeError = global.TypeError;
        this.RangeError = global.RangeError;
        this.ReferenceError = global.ReferenceError;
        this.URIError = global.URIError;
        this.decodeURI = global.decodeURI;
        this.decodeURIComponent = global.decodeURIComponent;
        this.encodeURI = global.encodeURI;
        this.encodeURIComponent = global.encodeURIComponent;
        this.escape = global.escape;
        this.unescape = global.escape;
        this.isNaN = global.isNaN;
        this.isFinite = global.isFinite;
        this.JSON = global.JSON;
        this.Int16Array = global.Int16Array;
        this.Int32Array = global.Int32Array;
        this.Int8Array = global.Int8Array;
        this.parseInt = global.parseInt;
        this.parseFloat = global.parseFloat;
        this.Math = global.Math;
        this.Map = global.Map;
        this.Promise = global.Promise;
        this.RegExp = global.RegExp;
        this.NaN = global.NaN;
        this.undefined = global.undefined;*/

        // Overrides abaixo

        

        this.console = {
            log: function() {
                djsMessage.channel.send("`Console.log:`\n" + Array.prototype.slice.call(arguments).join(" "))
            },
            debug: function() {
                djsMessage.channel.send("`Console.debug:`\n" + Array.prototype.slice.call(arguments).join(" "))
            },
            error: function() {
                djsMessage.channel.send("`Console.error:`\n" + Array.prototype.slice.call(arguments).join(" "))
            },
            info: function() {
                djsMessage.channel.send("`Console.info:`\n" + Array.prototype.slice.call(arguments).join(" "))
            },
            dir: function() {
                djsMessage.channel.send("`Console.dir:`\n" + Array.prototype.slice.call(arguments).join(" "))
            },
            clear: function() {
                djsMessage.channel.send("Não é possível limpar o console interno, afinal, são mensagens do Discord, não é verdade? Mas enfim, `console.clear()` foi chamado no código.")
            },
            warn: function() {
                djsMessage.channel.send("`Console.warn:`\n" + Array.prototype.slice.call(arguments).join(" "))
            },
        }
        this.eval = function(){throw new Error("A função eval é perigosa, portanto foi desativada.")}

    }
}

module.exports = {StrawberryContext, StrawberryLuma, StrawberryMessage, StrawberryTextChannel}
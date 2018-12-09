const snfetch = require("snekfetch");

var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;

var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

const isUrl = (string) =>{
    if (typeof string !== 'string') {
      return false;
    }
  
    var match = string.match(protocolAndDomainRE);
    if (!match) {
      return false;
    }
  
    var everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
      return false;
    }
  
    if (localhostDomainRE.test(everythingAfterProtocol) ||
        nonLocalhostDomainRE.test(everythingAfterProtocol)) {
      return true;
    }
  
    return false;
  }

const getImageFromAttachment = msg => {
    let firstAttachment = msg.attachments.first();

    if(firstAttachment) {
        if(firstAttachment.width) {
            return firstAttachment;
        }
    }

    return null;
}

const resolveImage = async msg => {
    let att = null;

    let fromMessage = getImageFromAttachment(msg);

    if(fromMessage) return fromMessage;

    if(msg.mentions.users.first()) {
        return {url: msg.mentions.users.first().avatarURL, width: 0}
    }

    let fetchedMessages = await msg.channel.fetchMessages({limit: 8})

    fetchedMessages = fetchedMessages.array().reverse();

    fetchedMessages.forEach(m => {
        let fromFetchedMessage = getImageFromAttachment(m);

        if(fromFetchedMessage) {
            att = fromFetchedMessage;
        } else {
            let args = msg.content.split(" ");
            args.forEach(arg => {
                if(isUrl(arg)) {
                    att = {url: arg, width: 0}
                }
            });
        }
    });

    return att || msg.author.avatarURL || msg.author.defaultAvatarURL || null;
}

const download = url => {
    return new Promise(resolve => {
        if(!url) {resolve(null); return}

        snfetch.get(url)
        .then(r => {
            if(Buffer.isBuffer(r.body)) {
                resolve(r.body);
                return;
            }

            resolve(null);
        })
        .catch(() => resolve(null));
    });
}

const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    var words = text.split(' ')
      , line = ''
      , lines = [];
  
    for(var n = 0, len = words.length; n < len; n++){
      var testLine = line + words[n] + ' '
        , metrics = ctx.measureText(testLine)
        , testWidth = metrics.width;
  
      if (testWidth > maxWidth) {
        lines.push({ text: line, x: x, y: y });
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
  
    lines.push({ text: line, x: x, y: y });
    return lines;
  };

module.exports = {
    getImageFromAttachment,
    resolveImage,
    download,
    wrapText
}
let Util = {};

Util.chunkArray = (arr, len) => {

  let chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}

Util.numToEmoji = num => {
    return Util.emojiNumberArray[num];
}

Util.emojiToNum = emoji => {
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

    return emojiMap[emoji] + 1;
}

Util.emojiNumberArray = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];

Util.emojis = {
    "youtube": "<:videoaleatorio:403983237254217728>"
}

Util.randomPositionFromArray = function(arr){
    return Math.floor(Math.random()*arr.length);
}

Util.randomItemFromArray = function(arr){
    return arr[Math.floor(Math.random()*arr.length)];
}

Util.getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Util.toHHMMSS = function (s) {
    var sec_num = parseInt(s / 1000, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+'h'+minutes+'m'+seconds+"s";
}

Util.wait = (ms = 0) => {
    return new Promise(r => setTimeout(r, ms));
}

Util.convertRange = ( value, r1, r2 ) => { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

Util.cleanMentions = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}

module.exports = Util;
/*
    IMPLEMENTAÇÃO DO LOQUENDO FEITA POR PANTHEON
*/
var snfetch = require("snekfetch");

module.exports.toSpeech = (texto, voz) => {
    voz = voz || "pt-br_male";
    return new Promise(async (resolve, reject) => {
        let response = await snfetch.get("http://ttsdemo.nuance.com/flashtts/pl/flashspeakJSONP.pl?language_gender=pt-br_male&text=" + encodeURIComponent(texto), {
            "rejectUnauthorized": false, 
            "headers": {
                "Referer": "https://www.nuance.com/landing-pages/playground/Vocalizer_Demo2/vocalizer_modal.html?demo=true",
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36"
            }
        });

        let body = response.body.toString().replace("vocalizerDemo('", "");
        body = body.replace("');", "");

        resp_1 = JSON.parse(body);

        // TTS OK?
        if(resp_1.status == "success") {
            // Juntar a response com propriedades customizadas
            var ret = Object.assign({}, resp_1, {
                "audiourl": `https://ttsdemo.nuance.com/flashtts/pl/loadmp3.pl?sessionid=${resp_1.sessionid}`
            });
            resolve(ret);
        } else {
            reject(resp_1);
        }
    });
 }
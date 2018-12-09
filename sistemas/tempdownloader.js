const path = require("path");
const fs = require("fs");
const snfetch = require("snekfetch");

let TEMP_BASE_DIR = "/tmp/";

function clean(name) {
    let FORBIDDEN = ["/", "<", ">", ":", "\"", "\\", "|", "?", "*"];

    FORBIDDEN.forEach(i => {
        name = name.split(i).join("");
    });

    return name;
}



function TempDownload(url, filename){
    let fpath = path.resolve(TEMP_BASE_DIR, clean(filename));

    return new Promise((resolve, reject) => {
        let s = fs.createWriteStream(fpath);
        snfetch.get(url)
        .pipe(s);

        s.on("finish", function(){
            resolve(fpath);
        });
    });
}

module.exports = TempDownload;
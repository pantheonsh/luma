const snekfetch = require("snekfetch");

let Upload = (buffer, name) => {
    return new Promise((resolve, reject) => {
        snekfetch.post("http://pomf.cat/upload.php")
        .attach("files[]", buffer, name)
        .then(resolve)
        .catch(reject)
    });
}

module.exports = Upload;
const http = require("https");

function DummyHTTPRequest(url) {
    return new Promise(resolve => {
        let r = http.get(url);

        r.on("response", () => {
            resolve();
        });
    });
}
module.exports = DummyHTTPRequest;
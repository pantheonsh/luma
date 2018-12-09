let snekfetch = require("snekfetch");

module.exports.postServerCount = count => {
  if(!count) return;
  
  return new Promise(resolve => {
    snekfetch.post("https://discordbots.org/api/bots/363804134518030356/stats")
    .set("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM2MzgwNDEzNDUxODAzMDM1NiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTEwMDk0NjgwfQ.zGlp2aebcUdWHXWp8cAdswDy4MGpRfM2ZYS8929Q3gQ")
    .send({ usingGoodRequestLibrary: true, server_count: count })
    .then(resolve);
  });
}
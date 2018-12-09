const moment = require("moment");

moment.locale("pt-br");

module.exports = {
    accountCreatedAt: user => moment(user.createdAt).format("DD/MM/YY @ hh:mm:ss"),
    accountAge: user => moment(user.createdAt).fromNow(),
    user: user => user.tag,
    mention: user => "<@" + user.id + ">",
    userid: user => user.id,
    now: () => moment(new Date()).format("DD/MM/YY @ hh:mm:ss")
}
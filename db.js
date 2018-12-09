const Keyv = require('keyv');
const config = require("./config");

/**
 * Na tabela de prefix, a chave é o ID do servidor
 * e o valor é o prefixo em si.
 */
const Prefix = new Keyv(config.keyv_providers.prefix);

Prefix.on('error', err => console.log(`Keyv error (Prefix)`, err));

module.exports = {
	Prefix
}
/*
    StrawberryScript é o nome da API scriptável da Luma.
    Desenvolvimento iniciado em 24/jan/2018
*/

const StrawberryClasses = require("./strawberry/StrawberryContext");

const VMClass = require('vm2').VM;

module.exports.executeScript = function(code, context, cbError){
    // colocar o código entre uma função, senão os tokens (if, while, etc) não funcionam
    // por algum motivo
    code = "(" + code + ")(__mensagem__, __luma__)";

    try {
        const VMCMD = new VMClass({
            timeout: 1000,
            sandbox: context
        });

        VMCMD.run(code, context);

    } catch(ex) {
        console.log(ex);
        cbError(ex);
    }
}

module.exports.Classes = StrawberryClasses;
const express = require('express');
const app = express();

const servico = require('./servico/servico');


app.get('/historicoIPCA/calculo', (req, res) => {
    const valor = parseFloat(req.query.valor);
    const mesInicial = parseInt(req.query.mesInicial);
    const mesFinal = parseInt(req.query.mesFinal);
    const anoInicial = parseInt(req.query.anoInicial);
    const anoFinal = parseInt(req.query.anoFinal);

    if(servico.validaError(valor, mesInicial, anoInicial, mesFinal, anoFinal)){
        let resposta = servico.validaError(valor, mesInicial, anoInicial, mesFinal, anoFinal)
        res.status(404).json({"erro": resposta});
        
    }

    const resultado = servico.calcularReajuste(valor, mesInicial, anoInicial, mesFinal, anoFinal);

    res.json({ "Valor": `${valor}`, "Ano inicial":  `${anoInicial}`, "Ano final":  `${anoFinal}`, "Mês inicial":  `${mesInicial}`, "Mês final":  `${mesFinal}`, "Resultado": `${resultado}` });
});


app.get('/historicoIPCA', (req, res) => {
    const ano = req.query.ano;
    const resultado = ano ? servico.buscaPorAnoIPCA(ano) : servico.retornaHistorico();

    if (resultado.length > 0) {
        res.json(resultado);
      } else {
        res.status(404).send({ "erro": `O ano declarado não foi encontrado: ${ano}` });
      }
});

app.get('/historicoIPCA/:id', (req, res) => {
    let idIPCA = servico.buscaPorIdIPCA(req.params.id);
    
    if(idIPCA) {
        res.json(idIPCA);
    }else if(isNaN(parseInt(req.params.id))) {
        res.status(400).json({"erro": "Requisição inválida"});
    }else {
        res.status(404).json({"erro": "IPCA não encontrado"});
    }
});


app.listen(8080, () => {
    let data = new Date().getHours();
    data += ":" + new Date().getMinutes();
    data += " do " + new Date().getDate();
    data += "/" + new Date().getMonth();
    data += "/" +  new Date().getFullYear();
    console.log(`Servidor conectado na porta: 8080, ás ${data}` );
});
let dados = require('../dados/dados');
let historico = dados.historicoInflacao;



function retornaHistorico() {
    return historico;
};

function buscaPorAnoIPCA(ano) {
    return historico.filter(e => e.ano == ano);
};

function buscaPorIdIPCA(id) {
    let idIPCA = parseInt(id);
    return historico.find(e => e.id === idIPCA);
};

exports.retornaHistorico = retornaHistorico;
exports.buscaPorAnoIPCA = buscaPorAnoIPCA;
exports.buscaPorIdIPCA = buscaPorIdIPCA;

/*===================================================
=====================================================*/

function validaError(valor, mesInicial, anoInicial, mesFinal, anoFinal) {
    const maximoAno = historico[historico.length - 1].ano;
    const minimoAno = historico[0].ano;
    const maximoMes = historico[historico.length - 1].mes;

    let resposta = ""
    /*if(
        isNaN(valor) ||
        isNaN(mesInicial) ||
        isNaN(anoInicial) ||
        isNaN(mesFinal) ||
        isNaN(anoFinal) ||
        mesInicial < 1 || mesInicial > 12 ||
        anoInicial < minimoAno || anoInicial > maximoAno ||
        mesFinal < 1 || mesFinal > 12 ||
        anoFinal < minimoAno || anoFinal > maximoAno ||
        (anoFinal === maximoAno && mesFinal > maximoMes) ||
        anoFinal < anoInicial ||
        (anoFinal == anoInicial && mesFinal < mesInicial)
    ){
        return true;
    } else {
        return false;
    }*/

    if(isNaN(valor) || isNaN(mesInicial) || isNaN(anoInicial) || isNaN(mesFinal) || isNaN(anoFinal)) {

        resposta = 'O valor está inválido';

    }else if(mesInicial < 1 || mesInicial > 12 ) {

        resposta = 'O valor do MÊS inicial está inválido';

    }else if(anoInicial < minimoAno || anoInicial > maximoAno) {
        
        resposta = 'O valor ANO inicial está inválido';

    }else if(mesFinal < 1 || mesFinal > 12) {

        resposta = 'O valor MÊS final está inválido';

    }else if(anoFinal < minimoAno || anoFinal > maximoAno) {

        resposta = 'O valor do ANO final esta incoreto';

    }else if((anoFinal === maximoAno && mesFinal > maximoMes)) {

        resposta = 'O valor do ANO final esta correto, porém o MÊS final esta a mais do que precisa. Mude o valor do MÊS final para que fique menor ou igual a 5';

    }else if(anoFinal < anoInicial) {

        resposta = 'O valor do ANO final esta menor do minimo do ANO';

    }else if((anoFinal == anoInicial && mesFinal < mesInicial)) {

        resposta = 'Valor do ANO final e do ANO inicial esta igual, porém o MÊS final esta menor do que o MÊS inicial';

    }else {
        return false;
    }

    return resposta;

}

const calcularReajuste = (valor, mesInicial, anoInicial, mesFinal, anoFinal) => {
    const historicoFiltrado = historico.filter(
      e => {
        if (anoInicial === anoFinal) {
          return e.ano === anoInicial && e.mes >= mesInicial && e.mes <= mesFinal;
        } else {
          return (
            (e.ano === anoInicial && e.mes >= mesInicial) ||
            (e.ano > anoInicial && e.ano < anoFinal) ||
            (e.ano === anoFinal && e.mes <= mesFinal)
          );
        }
      }
    );
  
     let taxasMensais = 1;
    historicoFiltrado.forEach( e => {
       taxasMensais = taxasMensais * (1 + (e.ipca / 100));
        
    });


    const resultado = valor * taxasMensais;
    return parseFloat(resultado.toFixed(2));
    
    
  };


exports.calcularReajuste = calcularReajuste;
exports.validaError = validaError;
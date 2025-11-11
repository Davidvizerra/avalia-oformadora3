$(function() {
    var dados = $('#dados-venda').data('venda');

    if (dados && dados.length > 0) {
        window.vendas = dados;
        window.indiceAtual = 0;
        // Força renderizar após o DOM estar pronto
        setTimeout(() => {
            ExibirVenda(vendas[indiceAtual]);
            AtualizarPosicao();
        }, 100);

        $("#anterior").click(() => Navegar(-1));
        $("#proximo").click(() => Navegar(1));
    } else {
       // $("#alertaW").show();
    }
});

// Exibe uma venda na tela
function ExibirVenda(venda) {
    $("#id_venda").val(venda.idVenda);
    $("#data_venda").val(venda.dataVenda);
    $("#forma_pagto").val(venda.formaPagto);

    // exibe nome ou razão social conforme o tipo do cliente
    if (venda.cliente.tipoCliente === "Jurídico") {
        $("#cliente").val(venda.cliente.razaoSocial);
    } else {
        $("#cliente").val(venda.cliente.nome);
    }

    let total = 0;
    $("#itensVenda").empty();
    venda.itens.forEach(item => {
        const valorUnitario = parseFloat(item.livro.valor) || 0;
        const totalItem = valorUnitario * item.qtdeVendida;
        total += totalItem;
        $("#itensVenda").append(`
            <tr>
                <td>${item.livro.titulo}</td>
                <td class="text-center">${item.qtdeVendida}</td>
                <td class="text-center">${valorUnitario.toFixed(2)}</td>
                <td class="text-center">${totalItem.toFixed(2)}</td>
            </tr>
        `);
    });

    //$("#total_venda").val(total.toFixed(2));
    $("#total_venda").text(total.toFixed(2));
}


// Navegação entre registros
function Navegar(direcao) {
    if (!window.vendas || vendas.length === 0) return;

    indiceAtual += direcao;
    if (indiceAtual < 0) indiceAtual = vendas.length - 1;
    if (indiceAtual >= vendas.length) indiceAtual = 0;

    ExibirVenda(vendas[indiceAtual]);
    AtualizarPosicao();
}

function AtualizarPosicao() {
    $("#posicaoVenda").text(`${indiceAtual + 1} / ${vendas.length}`);
}

$(function(){
    var dados = $('#dados-livro').data('livro');
    CarregarDados(dados);

    //* Botão Visualizar Registro */
    $('.visualiza').click(function(event) {
        event.preventDefault();
        $("#boxLocalizar").hide();
        $("#boxCadastro").show();
        $('#salvar').attr("disabled", "disabled");
        $('#formulario :input').attr("disabled", "disabled");

        var id = $(this).data('id');  
        Visualizar(id);
    });  

    //* Botão Editar Registro */
    $('.altera').click(function(event) {
        event.preventDefault();
        $("#boxLocalizar").hide();
        $("#boxCadastro").show();
        $('#salvar').removeAttr('disabled');
        $('#formulario :input').removeAttr("disabled");
        $('#id_livro').prop("readonly", true);

        var id = $(this).data('id');  
        Visualizar(id);
        $("#acao").val("alterar");
    }); 

    //* Botão Excluir Registro */
    var idParaExclusao;
    $('.exclui').click(function(event) {
        event.preventDefault();
        idParaExclusao = $(this).data('id');
        $('#confirmacaoExclusaoModal').modal('show');
    });

    $('#btnConfirmarExclusao').click(function() {
        Excluir(idParaExclusao);
    });
});

/** Carregar tabela com Registros */
function CarregarDados(dados) { 
    $('#linhas').empty();
    dados.forEach(function(dado) { 
        var row = '<tr>' +
            '<td>' + dado.idLivro + '</td>' +
            '<td>' + (dado.isbn ? dado.isbn : "---") + '</td>' +
            '<td>' + (dado.titulo ? dado.titulo : "---") + '</td>' +
            '<td>' + (dado.anoPublicacao ? dado.anoPublicacao : "---") + '</td>' +
            '<td>' + (dado.qtdeEstoque ? dado.qtdeEstoque : "---") + '</td>' +
            '<td>' + (dado.editora.nome ? dado.editora.nome : "---") + '</td>' +
            '<td>' + (dado.valor ? dado.valor : "---") + '</td>' +
            '<td><a href="#" class="visualiza" data-id="' + dado.idLivro + '"><i class="fa fa-search"></i></a></td>' +
            '<td><a href="#" class="altera" data-id="' + dado.idLivro + '"><i class="fa fa-pencil"></i></a></td>' +
            '<td><a href="#" class="exclui" data-id="' + dado.idLivro + '"><i class="fa fa-trash"></i></a></td>' +
            '</tr>';
        $('#linhas').append(row);
    });
}

/** Preencher formulário para novo Registro */
function Adicionar(){
    $("#boxLocalizar").hide();
    $("#boxCadastro").show();
    $('#salvar').removeAttr('disabled');
    $('#formulario :input').removeAttr("disabled");
    $('#id_livro').prop("readonly", true);
    CarregarComboEditora();

    $("#acao").val("incluir");
}

/** Cancelar Operação */
function Cancelar(){
    LimparCampos();
    $("#boxLocalizar").show();
    $("#boxCadastro").hide();
    $('#alerta').fadeOut();   

    var baseUrl = window.location.origin + '/AvaliacaoFormadora3/Livro'; 
    history.replaceState(null, null, baseUrl); 
}

/** Limpar campos do formulário de Cadastro */
function LimparCampos(){
    //$('#id_livro').val('');
    $('#isbn').val('');
    $('#titulo').val('');
    $('#ano_publicacao').val('');
    $('#qtde_estoque').val('');
    $('#valor').val('');
    $('#editora').val('');
}

/** Desabilitar todos os campos do Formulário */
function DesabilitarCampos(){
    $('#isbn').attr("disabled", "disabled");
    $('#titulo').attr("disabled", "disabled");
    $('#ano_publicacao').attr("disabled", "disabled");
    $('#qtde_estoque').attr("disabled", "disabled");
    $('#valor').attr("disabled", "disabled");
    $('#editora').attr("disabled", "disabled");
}

/** Validar os campos obrigatórios no formulário*/
function ValidarCampos(){
    if ($('#isbn').val() == '' || $('#titulo').val() == '' || $('#ano_publicacao').val() == '' ||
        $('#qtde_estoque').val() == '' || $('#valor').val() == '' || $('#editora').val() == '') {
        $('#alertaW').fadeIn();
        setTimeout(function(){
            $('#alertaW').fadeOut();
        }, 3000);
        return false;
    }
    return true;
}

/** Carregar o Registro que deseja visualizar no formulário */
function CarregarLivro(resposta){
    $('#isbn').val(resposta.isbn);
    $('#titulo').val(resposta.titulo);
    $('#ano_publicacao').val(resposta.anoPublicacao);
    $('#qtde_estoque').val(resposta.qtdeEstoque);
    $('#valor').val(resposta.valor);

    // Chama a função que carrega o combo e marca a editora correspondente
    CarregarComboEditora(resposta.editora.idEditora);
}

/** Carregar carrega o combobox de editoras */
function CarregarComboEditora(idSelecionado = null) {
    $.ajax({
        url: 'Editora/listarCombo',
        method: 'POST',
        dataType: 'json',
        success: function(editoras) {
            var combo = $('#editora');
            combo.empty();
            combo.append('<option value="">Selecione uma editora</option>');

            editoras.forEach(function(ed) {
                var selected = (idSelecionado && ed.idEditora == idSelecionado) ? 'selected' : '';
                combo.append('<option value="' + ed.idEditora + '" ' + selected + '>' + ed.nome + ' (' + ed.uf + ')</option>');
            });
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar editoras:', error);
        }
    });
}


/** Salvar um NOVO registro ou uma ATUALIZAÇÃO */
function Salvar(){
    if (!ValidarCampos()) return;

    var metodo = $("#acao").val() == "incluir" ? 'incluir' : 'alterar';
    var href = window.location.origin + '/AvaliacaoFormadora3/Livro/' + metodo;
    history.replaceState(null, null, href);

    var formData = $('#formCadastroLivro').serialize();

    $.ajax({
        url: href,
        type: 'POST',
        data: formData,
        success: function() {
            $('#alerta').fadeIn();
            $('#salvar').attr("disabled", "disabled");
            DesabilitarCampos();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Erro: ' + textStatus + " - " + errorThrown);
        }
    });      
}

/** Visualizar um Registro */
function Visualizar(id){
    LimparCampos();
    var parametro = id;  
    var href = window.location.origin + '/AvaliacaoFormadora3/Livro/visualizar/' + parametro;
    history.replaceState(null, null, href); 

    $.ajax({
        url: href,
        type: "POST",
        dataType: "json",
        data: {id: parametro},
        success: function(resposta){
            CarregarLivro(resposta);
        }
    });
}

/** Excluir um registro */
function Excluir(id){
    var parametro = id;  
    var href = window.location.origin + '/AvaliacaoFormadora3/Livro/excluir/' + parametro;
    history.replaceState(null, null, href); 

    $.ajax({
        url: href,
        method: 'POST',
        data: { id: parametro },
        success: function() {
            $('#confirmacaoExclusaoModal').modal('hide');
            $('#alerta').fadeIn();
            setTimeout(function(){
                $('#alerta').fadeOut();
            }, 3000);

            $('a.exclui[data-id="' + parametro + '"]').closest('tr').remove();
        },
        error: function(xhr, status, error) {
            console.error("Erro ao excluir livro:", error);
        }
    });

    var baseUrl = window.location.origin + '/AvaliacaoFormadora3/Livro'; 
    history.replaceState(null, null, baseUrl); 
}

/** Realizar pesquisa */
function Pesquisar(){
    var parametro = $('#txtpesquisa').val();
    var href = window.location.origin + '/AvaliacaoFormadora3/Livro/pesquisar/' + parametro;

    $.ajax({
        url: href,
        type: 'POST',
        dataType: 'json',
        data: { pesquisa: parametro },
        success: function(resposta) {
            CarregarDados(resposta);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

$(function(){
    var dados = $('#dados-autor').data('autor');
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
        $('#id_autor').prop("readonly", true);

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
            '<td>' + dado.idAutor + '</td>' +
            '<td>' + (dado.nome ? dado.nome : "---") + '</td>' +
            '<td>' + (dado.nacionalidade ? dado.nacionalidade : "---") + '</td>' +
            '<td><a href="#" class="visualiza" data-id="' + dado.idAutor + '"><i class="fa fa-search"></i></a></td>' +
            '<td><a href="#" class="altera" data-id="' + dado.idAutor + '"><i class="fa fa-pencil"></i></a></td>' +
            '<td><a href="#" class="exclui" data-id="' + dado.idAutor + '"><i class="fa fa-trash"></i></a></td>' +
            '</tr>';
        $('#linhas').append(row);
    });
}

/** Preencher formulário para novo Autor */
function Adicionar(){
    $("#boxLocalizar").hide();
    $("#boxCadastro").show();
    $('#salvar').removeAttr('disabled');
    $('#formulario :input').removeAttr("disabled");
    $('#id_autor').prop("readonly", true);

    $("#acao").val("incluir");
}

/** Cancelar Operação */
function Cancelar(){
    LimparCampos();
    $("#boxLocalizar").show();
    $("#boxCadastro").hide();
    $('#alerta').fadeOut();   

    var baseUrl = window.location.origin + '/AvaliacaoFormadora3/Autor'; // Base URL
    history.replaceState(null, null, baseUrl); 
}

/** Limpar campos do formulário de Cadastro de Autor */
function LimparCampos(){
    $('#id_autor').val('');
    $('#nome').val('');
    $('#nacionalidade').val('');
}

/** Desabilitar todos os campos do Formulário */
function DesabilitarCampos(){
    $('#nome').attr("disabled", "disabled");
    $('#nacionalidade').attr("disabled", "disabled");
}

/** Validar os campos obrigatórios no formulário de autores */
function ValidarCampos(){
    if ($('#nome').val() == '' || $('#nacionalidade').val() == '') {
        $('#alertaW').fadeIn();
        setTimeout(function(){
            $('#alertaW').fadeOut();
        }, 3000);
        return false;
    }
    return true;
}

/** Carregar o Registro que deseja visualizar no formulário */
function CarregarAutor(resposta){
    $('#id_autor').val(resposta.idAutor);
    $('#nome').val(resposta.nome);
    $('#nacionalidade').val(resposta.nacionalidade);
}

/** Salvar um NOVO registro de Autor ou uma ATUALIZAÇÃO */
function Salvar(){
    if (!ValidarCampos()) return;

    var metodo = $("#acao").val() == "incluir" ? 'incluir' : 'alterar';
    var href = window.location.origin + '/AvaliacaoFormadora3/Autor/' + metodo;
    history.replaceState(null, null, href);

    var formData = $('#formCadastroAutor').serialize();

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

/** Visualizar um Registro de Autor */
function Visualizar(id){
    LimparCampos();
    var parametro = id;  
    var href = window.location.origin + '/AvaliacaoFormadora3/Autor/visualizar/' + parametro;
    history.replaceState(null, null, href); 

    $.ajax({
        url: href,
        type: "POST",
        dataType: "json",
        data: {id: parametro},
        success: function(resposta){
            CarregarAutor(resposta);
        }
    });
}

/** Excluir um registro de Autor */
function Excluir(id){
    var parametro = id;  
    var href = window.location.origin + '/AvaliacaoFormadora3/Autor/excluir/' + parametro;
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
            console.error("Erro ao excluir autor:", error);
        }
    });

    var baseUrl = window.location.origin + '/AvaliacaoFormadora3/Autor'; 
    history.replaceState(null, null, baseUrl); 
}

/** Realizar pesquisa de Autores */
function Pesquisar(){
    var parametro = $('#txtpesquisa').val();
    var href = window.location.origin + '/AvaliacaoFormadora3/Autor/pesquisar/' + parametro;

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

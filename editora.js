$(function(){
    var dados = $('#dados-editora').data('editora');
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
        //$('#id_editora').prop("readonly", true);

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
            '<td>' + dado.idEditora + '</td>' +
            '<td>' + (dado.nome ? dado.nome : "---") + '</td>' +
            '<td>' + (dado.uf ? dado.uf : "---") + '</td>' +
            '<td><a href="#" class="visualiza" data-id="' + dado.idEditora + '"><i class="fa fa-search"></i></a></td>' +
            '<td><a href="#" class="altera" data-id="' + dado.idEditora + '"><i class="fa fa-pencil"></i></a></td>' +
            '<td><a href="#" class="exclui" data-id="' + dado.idEditora + '"><i class="fa fa-trash"></i></a></td>' +
            '</tr>';
        $('#linhas').append(row);
    });
}

/** Preencher formulário para nova Editora */
function Adicionar(){
    $("#boxLocalizar").hide();
    $("#boxCadastro").show();
    $('#salvar').removeAttr('disabled');
    $('#formulario :input').removeAttr("disabled");
    $('#id_editora').prop("readonly", true);

    $("#acao").val("incluir");
}

/** Cancelar Operação */
function Cancelar(){
    LimparCampos();
    $("#boxLocalizar").show();
    $("#boxCadastro").hide();
    $('#alerta').fadeOut();   

    var baseUrl = window.location.origin + '/AvaliacaoFormadora3/Editora'; 
    history.replaceState(null, null, baseUrl); 
}

/** Limpar campos do formulário de Cadastro de Editora */
function LimparCampos(){
    $('#id_editora').val('');
    $('#nome').val('');
    $('#endereco').val('');
    $('#telefone').val('');
}

/** Desabilitar todos os campos do Formulário */
function DesabilitarCampos(){
    $('#nome').attr("disabled", "disabled");
    $('#endereco').attr("disabled", "disabled");
    $('#telefone').attr("disabled", "disabled");
}

/** Validar os campos obrigatórios no formulário de Editora */
function ValidarCampos(){
    if ($('#nome').val() == '' || $('#endereco').val() == '') {
        $('#alertaW').fadeIn();
        setTimeout(function(){
            $('#alertaW').fadeOut();
        }, 3000);
        return false;
    }
    return true;
}

/** Carregar o Registro que deseja visualizar no formulário */
function CarregarEditora(resposta){
    //$('#id_editora').val(resposta.idEditora);
    $('#nome').val(resposta.nome);
    $('#uf').val(resposta.uf);
}

/** Salvar um NOVO registro de Editora ou uma ATUALIZAÇÃO */
function Salvar(){
    if (!ValidarCampos()) return;

    var metodo = $("#acao").val() == "incluir" ? 'incluir' : 'alterar';
    var href = window.location.origin + '/AvaliacaoFormadora3/Editora/' + metodo;
    history.replaceState(null, null, href);

    var formData = $('#formCadastroEditora').serialize();

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

/** Visualizar um Registro de Editora */
function Visualizar(id){
    LimparCampos();
    var parametro = id;  
    var href = window.location.origin + '/AvaliacaoFormadora3/Editora/visualizar/' + parametro;
    history.replaceState(null, null, href); 

    $.ajax({
        url: href,
        type: "POST",
        dataType: "json",
        data: {id: parametro},
        success: function(resposta){
            CarregarEditora(resposta);
        }
    });
}

/** Excluir um registro de Editora */
function Excluir(id){
    var parametro = id;  
    var href = window.location.origin + '/AvaliacaoFormadora3/Editora/excluir/' + parametro;
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
            console.error("Erro ao excluir editora:", error);
        }
    });

    var baseUrl = window.location.origin + '/AvaliacaoFormadora3/Editora'; 
    history.replaceState(null, null, baseUrl); 
}

/** Realizar pesquisa de Editoras */
function Pesquisar(){
    var parametro = $('#txtpesquisa').val();
    var href = window.location.origin + '/AvaliacaoFormadora3/Editora/pesquisar/' + parametro;

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

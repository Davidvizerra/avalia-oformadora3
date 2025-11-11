$(function(){   
    var dados = $('#dados-cliente').data('cliente');
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
        $('#id_cliente').prop("readonly", true);

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

    // Alternar tipo de cliente (físico/jurídico)
    $(document).on('change', 'input[name="tipoCliente"]', function() {
        var tipo = $(this).val();
        if (tipo === 'F') {
            $('#grupo-fisico').show();
            $('#grupo-juridico').hide();
        } else {
            $('#grupo-fisico').hide();
            $('#grupo-juridico').show();
        }
    });
});

/* -----------------------------------
   FUNÇÕES DE SUPORTE
------------------------------------ */

// Função para resetar URL do navegador
function ResetUrl() {
    var baseUrl = window.location.origin + '/AvaliacaoFormadora3/Cliente';
    history.replaceState(null, null, baseUrl);
}

/** Carregar tabela com Registros */
function CarregarDados(dados) { 
    $('#linhas').empty();
    dados.forEach(function(dado) { 
        var row = '<tr>' +
            '<td>' + dado.idCliente + '</td>' +
            '<td>' + (dado.cpf ? dado.cpf : "---") + '</td>' +
            '<td>' + (dado.nome ? dado.nome : "---") + '</td>' +
            '<td>' + (dado.cnpj ? dado.cnpj : "---") + '</td>' +
            '<td>' + (dado.razaoSocial ? dado.razaoSocial : "---") + '</td>' +
            '<td>' + dado.endereco + '</td>' +
            '<td><a href="#" class="visualiza" data-id="' + dado.idCliente + '"><i class="fa fa-search"></i></a></td>' +
            '<td><a href="#" class="altera" data-id="' + dado.idCliente + '"><i class="fa fa-pencil"></i></a></td>' +
            '<td><a href="#" class="exclui" data-id="' + dado.idCliente + '"><i class="fa fa-trash"></i></a></td>' +
            '</tr>';
        $('#linhas').append(row);
    });
}

/** Preencher formulário para novo Cliente */
function Adicionar(){
    $("#boxLocalizar").hide();
    $("#boxCadastro").show();
    $('#salvar').removeAttr('disabled');
    $('#formulario :input').removeAttr("disabled");
    $('#id_cliente').prop("readonly", true);
    $('#cnpj').attr("disabled", "disabled");
    $('#razao_social').attr("disabled", "disabled");
    $("#acao").val("incluir");
}

/** Cancelar Operação */
function Cancelar(){
    LimparCampos();
    $('#tipoFisico').prop('checked', true);
    $('#tipoJuridico').prop('checked', false);
    $("#boxLocalizar").show();
    $("#boxCadastro").hide();
    $('#alerta').fadeOut();   
    ResetUrl(); // 🔹 Corrige a URL
}

/** Limpar campos */
function LimparCampos(){
    $('#id_cliente').val('');
    $('#cnpj').val('');
    $('#razao_social').val('');
    $('#cpf').val('');
    $('#nome').val('');
    $('#endereco').val('');
}

/** Desabilitar campos */
function DesabilitarCampos(){
    $('#cnpj').attr("disabled", "disabled");
    $('#razao_social').attr("disabled", "disabled");
    $('#cpf').attr("disabled", "disabled");
    $('#nome').attr("disabled", "disabled");
    $('#endereco').attr("disabled", "disabled");
}

/** Validar campos obrigatórios */
function ValidarCampos(){
    if ($('#tipoFisico').prop('checked')) { 
        if ($('#cpf').val() == '' || $('#nome').val() == '' || $('#endereco').val() == ''){
            $('#alertaW').fadeIn();
            setTimeout(function(){ $('#alertaW').fadeOut(); }, 3000);
            return false;
        }
    } else {
        if ($('#cnpj').val() == '' || $('#razao_social').val() == '' || $('#endereco').val() == ''){
            $('#alertaW').fadeIn();
            setTimeout(function(){ $('#alertaW').fadeOut(); }, 3000);
            return false;
        }
    }
    return true;
}

/** Carregar cliente para visualização */
function CarregarCliente(resposta){
    $('#id_cliente').val(resposta.idCliente);
    $('#endereco').val(resposta.endereco);

    if(resposta.tipo == 'Físico'){
        $('#tipoFisico').prop('checked', true);
        $('#tipoJuridico').prop('checked', false);   
        $('#cpf').val(resposta.cpf);
        $('#nome').val(resposta.nome);
    } else {
        $('#tipoFisico').prop('checked', false);
        $('#tipoJuridico').prop('checked', true);
        $('#cnpj').val(resposta.cnpj);
        $('#razao_social').val(resposta.razaoSocial);
    }
}

/* -----------------------------------
   REQUISIÇÕES AJAX
------------------------------------ */

/** Salvar novo cliente ou alterar existente */
function Salvar(){
    if (!ValidarCampos()) return;

    var metodo = ($("#acao").val() == "incluir") ? 'incluir' : 'alterar';
    var href = window.location.origin + '/AvaliacaoFormadora3/Cliente/' + metodo;

    $.ajax({
        url: href,
        type: 'POST',
        data: $('#formCadastroCliente').serialize(),
        success: function() {
            $('#alerta').fadeIn();
            $('#salvar').attr("disabled", "disabled");
            DesabilitarCampos();
            ResetUrl(); // 🔹 Corrige a URL
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Erro: ' + textStatus + " - " + errorThrown);
        }
    });      
}

/** Visualizar cliente */
function Visualizar(id){
    LimparCampos();
    var href = window.location.origin + '/AvaliacaoFormadora3/Cliente/visualizar/' + id;

    $.ajax({
        url: href,
        type: "POST",
        dataType: "json",
        data: { id: id },
        success: function(resposta){
            CarregarCliente(resposta);
        },
        error: function() {
            alert('Erro ao visualizar cliente');
        }
    });
}

/** Excluir cliente */
function Excluir(id){
    var href = window.location.origin + '/AvaliacaoFormadora3/Cliente/excluir/' + id;

    $.ajax({
        url: href,
        method: 'POST',
        data: { id: id },
        success: function() {
            $('#confirmacaoExclusaoModal').modal('hide');
            $('#alerta').fadeIn();
            setTimeout(function(){ $('#alerta').fadeOut(); }, 3000);
            $('a.exclui[data-id="' + id + '"]').closest('tr').remove();
            ResetUrl(); // 🔹 Corrige a URL
        },
        error: function(xhr, status, error) {
            console.error("Erro ao excluir cliente:", error);
        }
    });
}

/** Pesquisar cliente */
function Pesquisar(){
    var parametro = $('#txtpesquisa').val();
    var href = window.location.origin + '/AvaliacaoFormadora3/Cliente/pesquisar/' + parametro;

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

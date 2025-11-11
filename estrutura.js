$(function() {

    $('li a').on('click', function(e) {
        e.preventDefault();
        // Obtenha o URL do link clicado
        var href = $(this).attr('href');
        // Atualize o histórico de navegação do navegador sem recarregar a página
        history.pushState(null, null, href); 
        //Faz uma requisição AJAX para carregar a página
        $.ajax({
            url: href,
            success: function(data){
                //$('#conteudo').html(data);
                var conteudo = $(data).find('#conteudo').html();
                $('#conteudo').html(conteudo);
            }
        });
    });

});



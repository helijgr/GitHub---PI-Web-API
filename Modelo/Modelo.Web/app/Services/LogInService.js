/**
 * IHM Engenharia
 * Service LogIn - Realiza as operações de acesso ao WebAPI relativas ao log de Usuario
 */
(function () {

    angular.module("app.web").factory("LogInService", LogInService);

    function LogInService($http, $state, $mdDialog, $rootScope, Constantes) {

        var Service = {            
            logIn: function (usuario) {

                //var data = "grant_type=password&username=" + usuario.codUsuario + "&password=" + usuario.password;

                //var data = "Basic " + btoa(usuario.codUsuario + ":" + usuario.password);
                $http.defaults.headers.common.Authorization = "Basic " + btoa(usuario.codUsuario + ":" + usuario.password);

                return $http.get(Constantes.API_URL_TOKEN)
                .then(function sucesso(resposta) {
                    $rootScope.usuarioLogado = usuario;
                    $rootScope.usuarioLogado.codUsuario = resposta.data.codUsuario;
                    $rootScope.usuarioLogado.nomeUsuario = resposta.data.nomeUsuario;
                    $rootScope.usuarioLogado.emailUsuario = resposta.data.emailUsuario;
                    $rootScope.usuarioLogado.domain = resposta.data.domain;


                    $rootScope.loginToken = resposta.data.access_token;

                    $mdDialog.hide();
                    
                },
                function erro(resposta) {
                    
                    $rootScope.errorPopup("Usuário ou senha incorreto.");

                })
            }
        }

        return Service;
    }

})()
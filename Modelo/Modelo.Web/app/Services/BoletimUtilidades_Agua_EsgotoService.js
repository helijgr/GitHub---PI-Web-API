﻿/**
 * IHM Engenharia
 * Service Apontamento Manual - Realiza as operações de acesso ao WebAPI
 */
(function () {

    angular.module("app.web").factory("BoletimUtilidades_Agua_EsgotoService", BoletimUtilidades_Agua_EsgotoService);

    function BoletimUtilidades_Agua_EsgotoService(Constantes, $http) {

        /*
       * Atributos privados.
       */
        var API_URL_CARREGA_ESTRUTURA = Constantes.API_URL_BASE.concat('/cliente/CarregarEstrutura');

        //-----------------------------------------------------------------------------------------

        /*
         * Interface pública.
         */

        return {
            recuperarClientes: function () {
                return $http.get(sprintf(API_URL_CARREGA_ESTRUTURA));
            }       
        };
        //-----------------------------------------------------------------------------------------

    }

})();
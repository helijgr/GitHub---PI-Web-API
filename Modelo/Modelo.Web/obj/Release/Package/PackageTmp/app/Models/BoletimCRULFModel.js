/**
 * IHM Engenharia
 * Model para Visualização da Associação de Analogicas
 */
(function () {

    angular.module("app.web").factory("BoletimCRULFModel", BoletimCRULFModel);

    function BoletimCRULFModel(BoletimCRULFService, $q) {
        /*
         * Atributos privados.
         */
        
        // Opções ta tabela de composições
        var optionsCompAtivas = {
            rowSelection: true,
            multiSelect: false,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: false,
            pageSelect: false
        };
        // Filtro da tabela de composições
        var queryCompAtivas = {
            order: 'DthSaidaTremPublicacaoPlanoEmbarque',
            limit: 5,
            page: 1
        };
        // Composição ativa que está selecionada na tabela
        var selectedCompAtiva = [];

        //-----------------------------------------------------------------------------------------

        /*
         * Funções privadas.
        */


        //-----------------------------------------------------------------------------------------

        /*
         * Funções públicas.
         */

        // Configurações das tabelas de apontamento e composição (A opção de paginação deverá estar habiltada)
        function toggleLimitOptions() {
            limitOptions = limitOptions ? undefined : [5, 10, 15];
        }
       

        //-----------------------------------------------------------------------------------------

        /*
         * Inicialização.
         */


       
        //-----------------------------------------------------------------------------------------

        /*
         * Interface pública.
         */

        var retorno = {
            toggleLimitOptions: toggleLimitOptions,
            selectedCompAtiva: selectedCompAtiva,
            queryCompAtivas: queryCompAtivas,
            optionsCompAtivas: optionsCompAtivas
        }

        return retorno;

        //-----------------------------------------------------------------------------------------

    };

})();
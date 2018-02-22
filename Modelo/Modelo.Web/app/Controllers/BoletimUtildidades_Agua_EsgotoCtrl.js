/**
 * IHM Engenharia
 * Controller Visualização de Associação das Analogicas
 */
(function () {

    angular.module("app.web").controller("BoletimUtilidades_Agua_EsgotoCtrl", BoletimUtilidades_Agua_EsgotoCtrl);

    function BoletimUtilidades_Agua_EsgotoCtrl(
        BoletimUtilidades_Agua_EsgotoModel, BoletimUtilidades_Agua_EsgotoService, $q, $rootScope, $scope, $state, $timeout, $mdDialog, Constantes, $http) {

        //-----------------------------------------------------------------------------------------
        /*
         * Funções privadas.
         */

        function Inicializar() {
            BoletimUtilidades_Agua_EsgotoModel.dthInicio = new Date();
            BoletimUtilidades_Agua_EsgotoModel.dataFimDiaGrafico = new Date();
            BoletimUtilidades_Agua_EsgotoModel.dataInicioDiaGrafico = new Date();
            BoletimUtilidades_Agua_EsgotoModel.dataInicioDiaGrafico.setDate(BoletimUtilidades_Agua_EsgotoModel.dataInicioDiaGrafico.getDate() - 15);
            BoletimUtilidades_Agua_EsgotoModel.habilitaCalendario = false;
            BoletimUtilidades_Agua_EsgotoModel.escondeGrafico = true;

            //Função pra formatar a data de pesquisa
            dthChange();

            // Carrega as composições ativas e os últimos navios
            $scope.BoletimUtilidades_Agua_EsgotoModel = BoletimUtilidades_Agua_EsgotoModel;

            carregaEstrutura();
        };

        // Seleciona uma composição e carrega seus apontamentos
        function checkboxCompClick() {
            BoletimUtilidades_Agua_EsgotoModel.escondeGrafico = false;
            graficoHora(BoletimUtilidades_Agua_EsgotoModel.selectedCompAtiva[0][0])
        };

        // Remove seleção de uma composição e desabilita a atualização automática
        function deselectComp() {
            BoletimUtilidades_Agua_EsgotoModel.escondeGrafico = true;
        };

        function montaArray() {
            BoletimUtilidades_Agua_EsgotoModel.ExibeDados = [];
            var j = 0;
            for (var i = 0; i < BoletimUtilidades_Agua_EsgotoModel.DadosRelatorio.length; i++) {
                if (i == 0) {
                    criaLinhaSubGrupo(BoletimUtilidades_Agua_EsgotoModel.DadosRelatorio[i].subGrupo, j);
                    j++;
                    criaLinhaElemento(BoletimUtilidades_Agua_EsgotoModel.DadosRelatorio[i], j);
                    j++;
                }
                else {
                    if (BoletimUtilidades_Agua_EsgotoModel.DadosRelatorio[i].subGrupo == BoletimUtilidades_Agua_EsgotoModel.DadosRelatorio[i - 1].subGrupo) {
                        criaLinhaElemento(BoletimUtilidades_Agua_EsgotoModel.DadosRelatorio[i], j);
                        j++;
                    }
                    else {
                        criaLinhaSubGrupo(BoletimUtilidades_Agua_EsgotoModel.DadosRelatorio[i].subGrupo, j);
                        j++;
                        criaLinhaElemento(BoletimUtilidades_Agua_EsgotoModel.DadosRelatorio[i], j);
                        j++;
                    }
                }
            }
        }

        function criaLinhaSubGrupo(subGrupo, linha) {
            BoletimUtilidades_Agua_EsgotoModel.ExibeDados[linha] = [{
                descricao: subGrupo,
                uom: "UOM",
                li: "Mínimo",
                meta: "Meta",
                ls: "Máximo",
                d: "D",
                d1: "D-1",
                d2: "D-2",
                m: "M",
                m1: "M-1",
                _Color: "green",
                fontColord: "black",
                fontColord1: "black",
                fontColord2: "black",
                fontColorm: "black",
                fontColorm1: "black"

            }]
        }

        function criaLinhaElemento(objeto, linha) {
            retornaD(objeto, linha);
        }

        function formatNumber(n) {
            if (!n) {
                return '';
            }

            let c = 2,
                d = ",",
                t = ".",
                s = n < 0 ? "-" : "",
                i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
                j = (i.length) > 3 ? i.length % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        };

        function invertFormatNumber(n) {
            if (!n) {
                return '';
            }

            let c = 2,
                d = ".",
                t = ",",
                s = n < 0 ? "-" : "",
                i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
                j = (i.length) > 3 ? i.length % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        };

        function retornaD(objeto, linha) {
            BoletimUtilidades_Agua_EsgotoModel.request = "";
            BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia = [];

            if (objeto.tipoRelatorio == 'Cálculo') {
                if (objeto.filtroExpressao == '-') {

                    var aux = angular.copy(BoletimUtilidades_Agua_EsgotoModel.dthInicio);
                    var inicio = new Date(aux.setDate(aux.getDate() - 2)).toISOString();
                    var fim = new Date(aux.setDate(aux.getDate() + 3)).toISOString();
                    var duracao = "1d";

                    request = montaUrlCalculo(objeto.tag, inicio, fim, objeto.tipoCalculo, duracao);
                    return $http.get(request)
                        .then(function sucesso(resposta) {
                            BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia = resposta.data.Items;

                            var auxMaximo = angular.copy(objeto.maximo);
                            var auxMinimo = angular.copy(objeto.minimo);

                            BoletimUtilidades_Agua_EsgotoModel.fontColord = 'black'
                            BoletimUtilidades_Agua_EsgotoModel.fontColord1 = 'black'
                            BoletimUtilidades_Agua_EsgotoModel.fontColord2 = 'black'

                            if (parseFloat(BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[2].Value.Value) > parseFloat(auxMaximo) || parseFloat(BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[2].Value.Value) < parseFloat(auxMinimo)) {
                                BoletimUtilidades_Agua_EsgotoModel.fontColord = 'red'
                            }
                            if (parseFloat(BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[1].Value.Value) > parseFloat(auxMaximo) || parseFloat(BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[1].Value.Value) < parseFloat(auxMinimo)) {
                                BoletimUtilidades_Agua_EsgotoModel.fontColord1 = 'red'
                            }
                            if (parseFloat(BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[0].Value.Value) > parseFloat(auxMaximo) || parseFloat(BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[0].Value.Value) < parseFloat(auxMinimo)) {
                                BoletimUtilidades_Agua_EsgotoModel.fontColord2 = 'red'
                            }
                            
                            for (var i = 0; i < BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia.length; i++) {
                                if (typeof (BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[i].Value.Value) == 'number') {
                                    BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[i].Value.Value = formatNumber(BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[i].Value.Value);
                                }
                                else {
                                    BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[i].Value.Value = '-'
                                }
                            }

                            retornaM(objeto, linha, BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[2].Value.Value, BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[1].Value.Value, BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[0].Value.Value, BoletimUtilidades_Agua_EsgotoModel.fontColord, BoletimUtilidades_Agua_EsgotoModel.fontColord1, BoletimUtilidades_Agua_EsgotoModel.fontColord2);
                        })
                }
                else {
                    BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[0].Value.Value = "-"
                    BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[1].Value.Value = "-"
                    BoletimUtilidades_Agua_EsgotoModel.retornoTotalDia[2].Value.Value = "-"
                }
            }
        }

        function montaUrlCalculo(expressao, inicio, fim, tipoCalculo, duracao) {
            var request = "https://ortpi.klabin.com.br/piwebapi/calculation/summary?expression=" + expressao +
                "&starttime=" + inicio + "&endtime=" + fim + "&summaryType=average&calculationbasis=" + tipoCalculo + "&summaryduration=" + duracao;

            return request;
        }

        function retornaM(objeto, linha, valorD, valorD1, valorD2, fontColord, fontColord1, fontColord2) {
            BoletimUtilidades_Agua_EsgotoModel.request = "";
            BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes = [];

            if (objeto.tipoRelatorio == 'Cálculo') {
                if (objeto.filtroExpressao == '-') {

                    var aux = angular.copy(BoletimUtilidades_Agua_EsgotoModel.dthInicio);
                    aux.setDate(1);
                    var inicio = new Date(aux.setMonth(aux.getMonth() - 1)).toISOString();
                    var fim = new Date(aux.setMonth(aux.getMonth() + 2)).toISOString();
                    var duracao = "1mo";

                    request = montaUrlCalculo(objeto.tag, inicio, fim, objeto.tipoCalculo, duracao);

                    return $http.get(request)
                        .then(function sucesso(resposta) {
                            BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes = resposta.data.Items;


                            var auxMaximo = angular.copy(objeto.maximo);
                            var auxMinimo = angular.copy(objeto.minimo);

                            BoletimUtilidades_Agua_EsgotoModel.fontColorm = 'black'
                            BoletimUtilidades_Agua_EsgotoModel.fontColorm1 = 'black'

                            if (BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[0].Value.Value > auxMaximo || BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[0].Value.Value < auxMinimo) {
                                BoletimUtilidades_Agua_EsgotoModel.fontColorm1 = 'red'
                            }
                            if (BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[1].Value.Value > auxMaximo || BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[1].Value.Value < auxMinimo) {
                                BoletimUtilidades_Agua_EsgotoModel.fontColorm = 'red'
                            }

                            for (var i = 0; i < BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes.length; i++) {
                                if (typeof (BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[i].Value.Value) == 'number') {
                                    BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[i].Value.Value = formatNumber(BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[i].Value.Value);

                                }
                                else {
                                    BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[i].Value.Value = '-'
                                }
                            }

                            BoletimUtilidades_Agua_EsgotoModel.ExibeDados[linha] = [{
                                descricao: objeto.elemento,
                                uom: objeto.uom,
                                li: objeto.minimo,
                                meta: objeto.meta,
                                ls: objeto.maximo,
                                d: valorD,
                                d1: valorD1,
                                d2: valorD2,
                                m: BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[1].Value.Value,
                                m1: BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[0].Value.Value,
                                tipoGrafico: objeto.tipoGrafico,
                                tipoCalculo: objeto.tipoCalculo,
                                filtroExpressao: objeto.filtroExpressao,
                                tag: objeto.tag,
                                fontColorm: BoletimUtilidades_Agua_EsgotoModel.fontColorm,
                                fontColorm1: BoletimUtilidades_Agua_EsgotoModel.fontColorm1,
                                fontColord: fontColord,
                                fontColord1: fontColord1,
                                fontColord2: fontColord2,
                            }]
                        })                  

                }
                else {
                    BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[0].Value.Value = "-";
                    BoletimUtilidades_Agua_EsgotoModel.retornoTotalMes[1].Value.Value = "-";
                }
            }
        }

         //Monta o objeto necessário para ser utilizado na montagem do gráfico
        function graficoHora(objeto) {
            BoletimUtilidades_Agua_EsgotoModel.habilitaCalendario = false;
            BoletimUtilidades_Agua_EsgotoModel.request = "";
            BoletimUtilidades_Agua_EsgotoModel.retornoGrafico = [];
            BoletimUtilidades_Agua_EsgotoModel.exibeGrafico = [];
            if (objeto.tipoGrafico == 'Média') {
                if (objeto.filtroExpressao == '-') {

                    var aux = angular.copy(BoletimUtilidades_Agua_EsgotoModel.dthInicio);
                    var inicio = new Date(aux.setDate(aux.getDate() - 1)).toISOString();
                    var fim = new Date(aux.setDate(aux.getDate() + 2)).toISOString();
                    var duracao = "1h";

                    request = montaUrlCalculo(objeto.tag, inicio, fim, objeto.tipoCalculo, duracao);
                    return $http.get(request)
                        .then(function sucesso(resposta) {
                            BoletimUtilidades_Agua_EsgotoModel.retornoGrafico = resposta.data.Items;
                            for (var i = 0; i < BoletimUtilidades_Agua_EsgotoModel.retornoGrafico.length; i++) {
                                if (BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Value > objeto.ls || BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Value < objeto.li) {
                                    objeto.color = "#e01f1f"
                                }
                                else {
                                    objeto.color = "#00a05a"
                                }
                                if (typeof (BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Value) == 'number') {
                                    BoletimUtilidades_Agua_EsgotoModel.exibeGrafico[i] = {
                                        "Value": BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Value, "Timestamp": new Date(BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Timestamp), "Meta": objeto.meta, "Minimo": objeto.li, "Maximo": objeto.ls, "color": objeto.color
                                    };
                                }
                                else {
                                    BoletimUtilidades_Agua_EsgotoModel.exibeGrafico[i] = {
                                        "Value": '', "Timestamp": new Date(BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Timestamp), "Meta": objeto.meta, "Minimo": objeto.li, "Maximo": objeto.ls, "color": objeto.color
                                    };
                                }
                            }
                            BoletimUtilidades_Agua_EsgotoModel.horasGrafico = true;
                            calculaFundoEscala(BoletimUtilidades_Agua_EsgotoModel.exibeGrafico, objeto.minimo);

                            criaGrafico();
                        })
                }
            }
        }

        // "Zoom" na escala do gráfico
        function calculaFundoEscala(arrayGrafico) {
            BoletimUtilidades_Agua_EsgotoModel.fundoDeEscala = arrayGrafico[0].Value;
            for (var i = 1; i < arrayGrafico.length; i++) {
                if (typeof (arrayGrafico[i].Value) == 'number') {
                    if (arrayGrafico[i].Value < BoletimUtilidades_Agua_EsgotoModel.fundoDeEscala) {
                        BoletimUtilidades_Agua_EsgotoModel.fundoDeEscala = arrayGrafico[i].Value;
                    }
                }
            }
            BoletimUtilidades_Agua_EsgotoModel.fundoDeEscala = BoletimUtilidades_Agua_EsgotoModel.fundoDeEscala * 0.90;
        }

        // Leitura do arquivo csv
        function carregaEstrutura() {

            var recuperar = BoletimUtilidades_Agua_EsgotoService.recuperarClientes();

            $rootScope.Waiting = $q.all([recuperar]);
            $rootScope.Waiting
                .then(function (resposta) {
                    if (resposta[0].data.Status == true) {
                        BoletimUtilidades_Agua_EsgotoModel.DadosRelatorio = resposta[0].data.Dados;
                    }
                    else {
                        $rootScope.errorPopup(resposta[0].data.Mensagem);
                    }
                })
                .catch(function (erro) {
                    $rootScope.errorPopup(resposta[0].data.Mensagem);
                });
        };

        //Gera o gráfico para ser exibido na tela
        function criaGrafico() {
            var chart = AmCharts.makeChart("chartdiv", {
                "type": "serial",
                "addClassNames": true,
                "theme": "light",
                "autoMargins": false,
                "marginLeft": 70,
                "marginRight": 8,
                "marginTop": 10,
                "marginBottom": 95,
                "balloon": {
                    "adjustBorderColor": false,
                    "horizontalPadding": 10,
                    "verticalPadding": 8,
                    "color": "#ffffff"
                },

                "dataProvider": BoletimUtilidades_Agua_EsgotoModel.exibeGrafico,
                "valueAxes": [{
                    "axisAlpha": 0,
                    "position": "left",
                    "minimum": BoletimUtilidades_Agua_EsgotoModel.fundoDeEscala
                }],
                "startDuration": 0,
                "graphs": [{
                    "alphaField": "alpha",
                    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                    "fillAlphas": 1,
                    "title": "Value",
                    "type": "column",
                    "valueField": "Value",
                    "dashLengthField": "dashLengthColumn",
                    "colorField": "color"
                }, {
                    "id": "graph2",
                    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                    "lineThickness": 3,
                    "fillAlphas": 0,
                    "lineAlpha": 1,
                    "title": "Limite Inferior",
                    "valueField": "Minimo",
                    "dashLengthField": "dashLengthLine",
                    "lineColor": "#e01f1f"
                }, {
                    "id": "graph3",
                    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                    "lineThickness": 3,
                    "fillAlphas": 0,
                    "lineAlpha": 1,
                    "title": "Limite Superior",
                    "valueField": "Maximo",
                    "dashLengthField": "dashLengthLine",
                    "lineColor": "#e01f1f"
                }, {
                    "id": "graph4",
                    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                    "lineThickness": 3,
                    "fillAlphas": 0,
                    "lineAlpha": 1,
                    "title": "Meta",
                    "valueField": "Meta",
                    "dashLengthField": "dashLengthLine",
                    "lineColor": "#4286f4"
                }],
                "categoryField": "Timestamp",
                "categoryAxis": {
                    "gridPosition": "start",
                    "axisAlpha": 0,
                    "tickLength": 0,
                    "labelRotation": 45,
                    "labelFunction": function (valueText, date, categoryAxis) {
                        var aux = new Date(valueText);
                        if (BoletimUtilidades_Agua_EsgotoModel.horasGrafico) {
                            return aux.toLocaleDateString() + " " + aux.toLocaleTimeString();
                        }
                        else {
                            return aux.toLocaleDateString();
                        }
                    }
                },
                "export": {
                    "enabled": false
                }
            });
        }

        //Monta o objeto necessário para ser utilizado na montagem do gráfico
        function graficoDia(objeto) {
            BoletimUtilidades_Agua_EsgotoModel.habilitaCalendario = true;
            BoletimUtilidades_Agua_EsgotoModel.request = "";
            BoletimUtilidades_Agua_EsgotoModel.retornoGrafico = [];
            BoletimUtilidades_Agua_EsgotoModel.exibeGrafico = [];
            dthChange();

            if (objeto.tipoGrafico == 'Média') {
                if (objeto.filtroExpressao == '-') {

                    var auxInicio = angular.copy(BoletimUtilidades_Agua_EsgotoModel.dataInicioDiaGrafico);
                    var auxFim = angular.copy(BoletimUtilidades_Agua_EsgotoModel.dataFimDiaGrafico);
                    var inicio = new Date(auxInicio).toISOString();
                    var fim = new Date(auxFim.setDate(auxFim.getDate() + 1)).toISOString();
                    var duracao = "1d";

                    request = montaUrlCalculo(objeto.tag, inicio, fim, objeto.tipoCalculo, duracao);
                    return $http.get(request)
                        .then(function sucesso(resposta) {
                            BoletimUtilidades_Agua_EsgotoModel.retornoGrafico = resposta.data.Items;
                            for (var i = 0; i < BoletimUtilidades_Agua_EsgotoModel.retornoGrafico.length; i++) {
                                if (BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Value > objeto.ls || BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Value < objeto.li) {
                                    objeto.color = "#e01f1f"
                                }
                                else {
                                    objeto.color = "#00a05a"
                                }
                                if (typeof (BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Value) == 'number') {
                                    BoletimUtilidades_Agua_EsgotoModel.exibeGrafico[i] = {
                                        "Value": BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Value, "Timestamp": new Date(BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Timestamp), "Meta": objeto.meta, "Minimo": objeto.li, "Maximo": objeto.ls, "color": objeto.color
                                    };
                                }
                                else {
                                    BoletimUtilidades_Agua_EsgotoModel.exibeGrafico[i] = {
                                        "Value": '', "Timestamp": new Date(BoletimUtilidades_Agua_EsgotoModel.retornoGrafico[i].Value.Timestamp), "Meta": objeto.meta, "Minimo": objeto.li, "Maximo": objeto.ls, "color": objeto.color
                                    };
                                }
                            }
                            BoletimUtilidades_Agua_EsgotoModel.horasGrafico = false;
                            criaGrafico();
                        })
                }
            }
        }

        // Define as cores das células da tabela, vermelho para fora dos limites e preto quando estiver dentro
        function validaLimites(dados, tipo) {
            if (tipo == "d") {
                if (dados.fontColord == "red") {
                    return "tabelaVermelha"
                }
                else {
                    return "tabelaPreta"
                }
            }
            if (tipo == "d1") {
                if (dados.fontColord1 == "red") {
                    return "tabelaVermelha"
                }
                else {
                    return "tabelaPreta"
                }
            }
            if (tipo == "d2") {
                if (dados.fontColord2 == "red") {
                    return "tabelaVermelha"
                }
                else {
                    return "tabelaPreta"
                }
            }        
            if (tipo == "m") {
                if (dados.fontColorm == "red") {
                    return "tabelaVermelha"
                }
                else {
                    return "tabelaPreta"
                }
            }
            if (tipo == "m1") {
                if (dados.fontColorm1 == "red") {
                    return "tabelaVermelha"
                }
                else {
                    return "tabelaPreta"
                }
            }
        }

        // Configura os horários de pesquisa selecionado pelo usuário
        function dthChange() {
            // Configura as horas das datas de pesquisa da tela
            BoletimUtilidades_Agua_EsgotoModel.dthInicio.setHours(0);
            BoletimUtilidades_Agua_EsgotoModel.dthInicio.setMinutes(0);
            BoletimUtilidades_Agua_EsgotoModel.dthInicio.setSeconds(0);

            BoletimUtilidades_Agua_EsgotoModel.dataInicioDiaGrafico.setHours(0);
            BoletimUtilidades_Agua_EsgotoModel.dataInicioDiaGrafico.setMinutes(0);
            BoletimUtilidades_Agua_EsgotoModel.dataInicioDiaGrafico.setSeconds(0);

            BoletimUtilidades_Agua_EsgotoModel.dataFimDiaGrafico.setHours(0);
            BoletimUtilidades_Agua_EsgotoModel.dataFimDiaGrafico.setMinutes(0);
            BoletimUtilidades_Agua_EsgotoModel.dataFimDiaGrafico.setSeconds(0);
        };

        //-----------------------------------------------------------------------------------------
        /*
         * Inicialização.
         */

        Inicializar();


        //-----------------------------------------------------------------------------------------
        /*
         * Interface pública.
         */

        return {
            dthChange: dthChange,
            checkboxCompClick: checkboxCompClick,
            montaArray: montaArray,
            graficoDia: graficoDia,
            graficoHora: graficoHora,
            validaLimites: validaLimites
        };
        //-----------------------------------------------------------------------------------------
    }

})();
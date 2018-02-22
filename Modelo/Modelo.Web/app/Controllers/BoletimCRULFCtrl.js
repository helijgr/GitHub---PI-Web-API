/**
 * IHM Engenharia
 * Controller Visualização de Associação das Analogicas
 */
(function () {

    angular.module("app.web").controller("BoletimCRULFCtrl", BoletimCRULFCtrl);

    function BoletimCRULFCtrl(
        BoletimCRULFModel, BoletimCRULFService, $q, $rootScope, $scope, $state, $timeout, $mdDialog, Constantes, $http) {

        //-----------------------------------------------------------------------------------------
        /*
         * Funções privadas.
         */

        function Inicializar() {
            BoletimCRULFModel.dthInicio = new Date();
            BoletimCRULFModel.dataFimDiaGrafico = new Date();
            BoletimCRULFModel.dataInicioDiaGrafico = new Date();
            BoletimCRULFModel.dataInicioDiaGrafico.setDate(BoletimCRULFModel.dataInicioDiaGrafico.getDate() - 15);
            BoletimCRULFModel.habilitaCalendario = false;
            BoletimCRULFModel.escondeGrafico = true;

            //Função pra formatar a data de pesquisa
            dthChange();

            // Carrega as composições ativas e os últimos navios
            $scope.BoletimCRULFModel = BoletimCRULFModel;

            carregaEstrutura();
        };

        // Seleciona uma composição e carrega seus apontamentos
        function checkboxCompClick() {
            BoletimCRULFModel.escondeGrafico = false;
            graficoHora(BoletimCRULFModel.selectedCompAtiva[0][0])
        };

        // Remove seleção de uma composição e desabilita a atualização automática
        function deselectComp() {
            BoletimCRULFModel.escondeGrafico = true;
        };

        function montaArray() {
            BoletimCRULFModel.ExibeDados = [];
            var j = 0;
            for (var i = 0; i < BoletimCRULFModel.DadosRelatorio.length; i++) {
                if (i == 0) {
                    criaLinhaSubGrupo(BoletimCRULFModel.DadosRelatorio[i].subGrupo, j);
                    j++;
                    criaLinhaElemento(BoletimCRULFModel.DadosRelatorio[i], j);
                    j++;
                }
                else {
                    if (BoletimCRULFModel.DadosRelatorio[i].subGrupo == BoletimCRULFModel.DadosRelatorio[i - 1].subGrupo) {
                        criaLinhaElemento(BoletimCRULFModel.DadosRelatorio[i], j);
                        j++;
                    }
                    else {
                        criaLinhaSubGrupo(BoletimCRULFModel.DadosRelatorio[i].subGrupo, j);
                        j++;
                        criaLinhaElemento(BoletimCRULFModel.DadosRelatorio[i], j);
                        j++;
                    }
                }
            }
        }

        function criaLinhaSubGrupo(subGrupo, linha) {
            BoletimCRULFModel.ExibeDados[linha] = [{
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
                fontColorm1: "black",
                casasDecimais: "casasDecimais",

            }]
        }

        function criaLinhaElemento(objeto, linha) {
            retornaD(objeto, linha);
        }

        function formatNumber(n,CD) {
            if (!n) {
                return '';
            }

            let c = CD,
                d = ",",
                t = ".",
                s = n < 0 ? "-" : "",
                i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
                j = (i.length) > (3) ? i.length % (3) : 0;
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
            BoletimCRULFModel.request = "";
            BoletimCRULFModel.retornoTotalDia = [];
            
            if (objeto.tipoRelatorio == 'Cálculo') {
                if (objeto.filtroExpressao == '-') {

                    var aux = angular.copy(BoletimCRULFModel.dthInicio);
                    var inicio = new Date(aux.setDate(aux.getDate() - 2)).toISOString();
                    var fim = new Date(aux.setDate(aux.getDate() + 3)).toISOString();
                    var duracao = "1d";

                    var cd = String(parseInt(Math.abs(Number(objeto.meta) || 0).toFixed(3)));
                    objeto.casasDecimais = (cd.length) >= 3 ? 0 : 3 - (cd.length % 3);

                    request = montaUrlCalculo(objeto.tag, inicio, fim, objeto.tipoCalculo, duracao);
                    return $http.get(request)
                        .then(function sucesso(resposta) {
                            BoletimCRULFModel.retornoTotalDia = resposta.data.Items;
                            var auxMaximo = angular.copy(objeto.maximo);
                            var auxMinimo = angular.copy(objeto.minimo);

                            BoletimCRULFModel.fontColord = 'black'
                            BoletimCRULFModel.fontColord1 = 'black'
                            BoletimCRULFModel.fontColord2 = 'black'

                            if (parseFloat(BoletimCRULFModel.retornoTotalDia[2].Value.Value) > parseFloat(auxMaximo) || parseFloat(BoletimCRULFModel.retornoTotalDia[2].Value.Value) < parseFloat(auxMinimo)) {
                                BoletimCRULFModel.fontColord = 'red'
                            }
                            if (parseFloat(BoletimCRULFModel.retornoTotalDia[1].Value.Value) > parseFloat(auxMaximo) || parseFloat(BoletimCRULFModel.retornoTotalDia[1].Value.Value) < parseFloat(auxMinimo)) {
                                BoletimCRULFModel.fontColord1 = 'red'
                            }
                            if (parseFloat(BoletimCRULFModel.retornoTotalDia[0].Value.Value) > parseFloat(auxMaximo) || parseFloat(BoletimCRULFModel.retornoTotalDia[0].Value.Value) < parseFloat(auxMinimo)) {
                                BoletimCRULFModel.fontColord2 = 'red'
                            }
                            
                            for (var i = 0; i < BoletimCRULFModel.retornoTotalDia.length; i++) {
                                if (typeof (BoletimCRULFModel.retornoTotalDia[i].Value.Value) == 'number') {
                                    BoletimCRULFModel.retornoTotalDia[i].Value.Value = formatNumber(BoletimCRULFModel.retornoTotalDia[i].Value.Value,objeto.casasDecimais);
                                }
                                else {
                                    BoletimCRULFModel.retornoTotalDia[i].Value.Value = '-'
                                }
                            }

                            retornaM(objeto, linha, BoletimCRULFModel.retornoTotalDia[2].Value.Value, BoletimCRULFModel.retornoTotalDia[1].Value.Value, BoletimCRULFModel.retornoTotalDia[0].Value.Value, BoletimCRULFModel.fontColord, BoletimCRULFModel.fontColord1, BoletimCRULFModel.fontColord2);
                        })
                }
                else if (objeto.tipoRelatorio == "Ultimo") {

                }
                else if (objeto.tipoRelatorio == "Totalizador") {
                    var aux = angular.copy(BoletimCRULFModel.dthInicio);
                    var inicio = new Date(aux.setDate(aux.getDate() - 2)).toISOString();
                    var fim = new Date(aux.setDate(aux.getDate() + 3)).toISOString();
                    var duracao = "1d";

                    request = montaUrlTotalizador(objeto.tag, fim);

                    return $http.get(request)
                        .then(function sucesso(resposta) {
                            BoletimCRULFModel.retornoTotalDia = resposta.data.Items;

                            var auxMaximo = angular.copy(objeto.maximo);
                            var auxMinimo = angular.copy(objeto.minimo);

                            BoletimCRULFModel.fontColord = 'black'

                            if (parseFloat(BoletimCRULFModel.retornoTotalDia[2].Value.Value) > parseFloat(auxMaximo) || parseFloat(BoletimCRULFModel.retornoTotalDia[2].Value.Value) < parseFloat(auxMinimo)) {
                                BoletimCRULFModel.fontColord = 'red'
                            }

                            if (typeof (BoletimCRULFModel.retornoTotalDia[i].Value.Value) == 'number') {
                                BoletimCRULFModel.retornoTotalDia[i].Value.Value = formatNumber(BoletimCRULFModel.retornoTotalDia[i].Value.Value, objeto.casasDecimais);
                            }

                            retornaM(objeto, linha, BoletimCRULFModel.retornoTotalDia[2].Value.Value, BoletimCRULFModel.retornoTotalDia[1].Value.Value, BoletimCRULFModel.retornoTotalDia[0].Value.Value, BoletimCRULFModel.fontColord, BoletimCRULFModel.fontColord1, BoletimCRULFModel.fontColord2);
                        })
                }
                else {
                    BoletimCRULFModel.retornoTotalDia[0].Value.Value = "-"
                    BoletimCRULFModel.retornoTotalDia[1].Value.Value = "-"
                    BoletimCRULFModel.retornoTotalDia[2].Value.Value = "-"
                }
            }
        }

        function montaUrlCalculo(expressao, inicio, fim, tipoCalculo, duracao) {
            var request = "https://ortpi.klabin.com.br/piwebapi/calculation/summary?expression=" + expressao +
                "&starttime=" + inicio + "&endtime=" + fim + "&summaryType=average&calculationbasis=" + tipoCalculo + "&summaryduration=" + duracao;

            return request;
        }

        function montaUrlTotalizador(expressao, tempo) {
            var request = "https://ortpi.klabin.com.br/piwebapi/calculation/times?expression=" + expressao +
                "&time=" + tempo;

            return request;
        }

        function montaUrlValorUnico(expressao, inicio, fim, duracao) {
            var request = "https://ortpi.klabin.com.br/piwebapi/calculation/intervals?expression=" + expressao +
                "&starttime=" + inicio + "&endtime=" + fim + "&sampleInterval=" + duracao;

            return request;
        }

        function retornaM(objeto, linha, valorD, valorD1, valorD2, fontColord, fontColord1, fontColord2) {
            BoletimCRULFModel.request = "";
            BoletimCRULFModel.retornoTotalMes = [];

            if (objeto.tipoRelatorio == 'Cálculo') {
                if (objeto.filtroExpressao == '-') {

                    var aux = angular.copy(BoletimCRULFModel.dthInicio);
                    aux.setDate(1);
                    var inicio = new Date(aux.setMonth(aux.getMonth() - 1)).toISOString();
                    var fim = new Date(aux.setMonth(aux.getMonth() + 2)).toISOString();
                    var duracao = "1mo";

                    request = montaUrlCalculo(objeto.tag, inicio, fim, objeto.tipoCalculo, duracao);

                    return $http.get(request)
                        .then(function sucesso(resposta) {
                            BoletimCRULFModel.retornoTotalMes = resposta.data.Items;

                            var auxMaximo = angular.copy(objeto.maximo);
                            var auxMinimo = angular.copy(objeto.minimo);

                            BoletimCRULFModel.fontColorm = 'black'
                            BoletimCRULFModel.fontColorm1 = 'black'

                            if (BoletimCRULFModel.retornoTotalMes[0].Value.Value > auxMaximo || BoletimCRULFModel.retornoTotalMes[0].Value.Value < auxMinimo) {
                                BoletimCRULFModel.fontColorm1 = 'red'
                            }
                            if (BoletimCRULFModel.retornoTotalMes[1].Value.Value > auxMaximo || BoletimCRULFModel.retornoTotalMes[1].Value.Value < auxMinimo) {
                                BoletimCRULFModel.fontColorm = 'red'
                            }

                            for (var i = 0; i < BoletimCRULFModel.retornoTotalMes.length; i++) {
                                if (typeof (BoletimCRULFModel.retornoTotalMes[i].Value.Value) == 'number') {
                                    BoletimCRULFModel.retornoTotalMes[i].Value.Value = formatNumber(BoletimCRULFModel.retornoTotalMes[i].Value.Value,objeto.casasDecimais);

                                }
                                else {
                                    BoletimCRULFModel.retornoTotalMes[i].Value.Value = '-'
                                }
                            }

                            BoletimCRULFModel.ExibeDados[linha] = [{
                                descricao: objeto.elemento,
                                uom: objeto.uom,
                                li: objeto.minimo,
                                meta: objeto.meta,
                                ls: objeto.maximo,
                                d: valorD,
                                d1: valorD1,
                                d2: valorD2,
                                m: BoletimCRULFModel.retornoTotalMes[1].Value.Value,
                                m1: BoletimCRULFModel.retornoTotalMes[0].Value.Value,
                                tipoGrafico: objeto.tipoGrafico,
                                tipoCalculo: objeto.tipoCalculo,
                                filtroExpressao: objeto.filtroExpressao,
                                tag: objeto.tag,
                                fontColorm: BoletimCRULFModel.fontColorm,
                                fontColorm1: BoletimCRULFModel.fontColorm1,
                                fontColord: fontColord,
                                fontColord1: fontColord1,
                                fontColord2: fontColord2,
                                casasDecimais: objeto.casasDecimais,
                            }]
                        })                  

                }
                else {
                    BoletimCRULFModel.retornoTotalMes[0].Value.Value = "-";
                    BoletimCRULFModel.retornoTotalMes[1].Value.Value = "-";
                }
            }
        }

         //Monta o objeto necessário para ser utilizado na montagem do gráfico
        function graficoHora(objeto) {
            BoletimCRULFModel.habilitaCalendario = false;
            BoletimCRULFModel.request = "";
            BoletimCRULFModel.retornoGrafico = [];
            BoletimCRULFModel.exibeGrafico = [];
            if (objeto.tipoGrafico == 'Média') {
                if (objeto.filtroExpressao == '-') {

                    var aux = angular.copy(BoletimCRULFModel.dthInicio);
                    var inicio = new Date(aux.setDate(aux.getDate() - 1)).toISOString();
                    var fim = new Date(aux.setDate(aux.getDate() + 2)).toISOString();
                    var duracao = "1h";

                    request = montaUrlCalculo(objeto.tag, inicio, fim, objeto.tipoCalculo, duracao);
                    return $http.get(request)
                        .then(function sucesso(resposta) {
                            BoletimCRULFModel.retornoGrafico = resposta.data.Items;
                            for (var i = 0; i < BoletimCRULFModel.retornoGrafico.length; i++) {
                                if (BoletimCRULFModel.retornoGrafico[i].Value.Value > objeto.ls || BoletimCRULFModel.retornoGrafico[i].Value.Value < objeto.li) {
                                    objeto.color = "#e01f1f"
                                }
                                else {
                                    objeto.color = "#00a05a"
                                }
                                if (typeof (BoletimCRULFModel.retornoGrafico[i].Value.Value) == 'number') {
                                    BoletimCRULFModel.exibeGrafico[i] = {
                                        "Value": BoletimCRULFModel.retornoGrafico[i].Value.Value, "Timestamp": new Date(BoletimCRULFModel.retornoGrafico[i].Value.Timestamp), "Meta": objeto.meta, "Minimo": objeto.li, "Maximo": objeto.ls, "color": objeto.color
                                    };
                                }
                                else {
                                    BoletimCRULFModel.exibeGrafico[i] = {
                                        "Value": '', "Timestamp": new Date(BoletimCRULFModel.retornoGrafico[i].Value.Timestamp), "Meta": objeto.meta, "Minimo": objeto.li, "Maximo": objeto.ls, "color": objeto.color
                                    };
                                }
                            }
                            BoletimCRULFModel.horasGrafico = true;
                            calculaFundoEscala(BoletimCRULFModel.exibeGrafico,objeto.li);

                            criaGrafico(objeto.casasDecimais);
                        })
                }
            }
        }

        // "Zoom" na escala do gráfico
        function calculaFundoEscala(arrayGrafico, minimo) {
            BoletimCRULFModel.fundoDeEscala = arrayGrafico[0].Value;
            for (var i = 1; i < arrayGrafico.length; i++) {
                if (typeof (arrayGrafico[i].Value) == 'number') {
                    if (arrayGrafico[i].Value < BoletimCRULFModel.fundoDeEscala) {
                        BoletimCRULFModel.fundoDeEscala = arrayGrafico[i].Value;
                    }
                }
            }
            if (BoletimCRULFModel.fundoDeEscala < minimo) {
                BoletimCRULFModel.fundoDeEscala = BoletimCRULFModel.fundoDeEscala * 0.90;
            } else {
                BoletimCRULFModel.fundoDeEscala = minimo*0.9
            }
            
        }

        // Leitura do arquivo csv
        function carregaEstrutura() {

            var recuperar = BoletimCRULFService.recuperarClientes("RelatorioInterfaceCaldeiraELinhaDeFibras");

            $rootScope.Waiting = $q.all([recuperar]);
            $rootScope.Waiting
                .then(function (resposta) {
                    if (resposta[0].data.Status == true) {
                        BoletimCRULFModel.DadosRelatorio = resposta[0].data.Dados;
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
        function criaGrafico(casasDecimais) {

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
                //Inicio-Heli
               // "mouseWheelZoomEnabled": true, 
                "numberFormatter": {
                    "precision": casasDecimais,
                    "decimalSeparator": ",",
                    "thousandsSeparator":"."
                },
                //Fim-Heli
                "dataProvider": BoletimCRULFModel.exibeGrafico,
                "valueAxes": [{
                    "axisAlpha": 0,
                    "position": "left",
                    "minimum": BoletimCRULFModel.fundoDeEscala
                }],
                "startDuration": 0,
                "graphs": [{
                    "alphaField": "alpha",
                    //"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span></span>", 
                    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span></span>", 
                    "fillAlphas": 0.75,
                    "title": "Value",
                    "type": "column",
                    "valueField": "Value",
                    "dashLengthField": "dashLengthColumn",
                    "colorField": "color",
                    "lineColor": "color"
                }, {
                    "id": "graph2",
                    "lineThickness": 3,
                    "fillAlphas": 0,
                    "lineAlpha": 1,
                    "title": "Limite Inferior",
                    "valueField": "Minimo",
                    "dashLength": 5,
                    "dashLengthField": "dashLengthLine",
                    "lineColor": "#FF0000"
                }, {
                    "id": "graph3","lineThickness": 3,
                    "fillAlphas": 0,
                    "lineAlpha": 1,
                    "title": "Limite Superior",
                    "valueField": "Maximo",
                    "dashLength": 5,
                    "dashLengthField": "dashLengthLine",
                    "lineColor": "#FF0000"
                }, {
                    "id": "graph4","lineThickness": 3,
                    "fillAlphas": 0,
                    "lineAlpha": 1,
                    "title": "Meta",
                    "valueField": "Meta",
                    "dashLength": 5,
                    //"dashLengthField": "dashLengthLine",
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
                        if (BoletimCRULFModel.horasGrafico) {
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
            BoletimCRULFModel.habilitaCalendario = true;
            BoletimCRULFModel.request = "";
            BoletimCRULFModel.retornoGrafico = [];
            BoletimCRULFModel.exibeGrafico = [];
            dthChange();

            if (objeto.tipoGrafico == 'Média') {
                if (objeto.filtroExpressao == '-') {

                    var auxInicio = angular.copy(BoletimCRULFModel.dataInicioDiaGrafico);
                    var auxFim = angular.copy(BoletimCRULFModel.dataFimDiaGrafico);
                    var inicio = new Date(auxInicio).toISOString();
                    var fim = new Date(auxFim.setDate(auxFim.getDate() + 1)).toISOString();
                    var duracao = "1d";

                    request = montaUrlCalculo(objeto.tag, inicio, fim, objeto.tipoCalculo, duracao);
                    return $http.get(request)
                        .then(function sucesso(resposta) {
                            BoletimCRULFModel.retornoGrafico = resposta.data.Items;
                            for (var i = 0; i < BoletimCRULFModel.retornoGrafico.length; i++) {
                                if (BoletimCRULFModel.retornoGrafico[i].Value.Value > objeto.ls || BoletimCRULFModel.retornoGrafico[i].Value.Value < objeto.li) {
                                    objeto.color = "#FE2E2E"
                                    objeto.lineColor = "#FE2E2E"
                                }
                                else {
                                    objeto.color = "#00a05a"
                                    objeto.lineColor ="#00a05a"
                                }
                                if (typeof (BoletimCRULFModel.retornoGrafico[i].Value.Value) == 'number') {
                                    BoletimCRULFModel.exibeGrafico[i] = {
                                        "Value": BoletimCRULFModel.retornoGrafico[i].Value.Value, "Timestamp": new Date(BoletimCRULFModel.retornoGrafico[i].Value.Timestamp), "Meta": objeto.meta, "Minimo": objeto.li, "Maximo": objeto.ls, "color": objeto.color
                                    };
                                }
                                else {
                                    BoletimCRULFModel.exibeGrafico[i] = {
                                        "Value": '', "Timestamp": new Date(BoletimCRULFModel.retornoGrafico[i].Value.Timestamp), "Meta": objeto.meta, "Minimo": objeto.li, "Maximo": objeto.ls, "color": objeto.color
                                    };
                                }
                            }
                            BoletimCRULFModel.horasGrafico = false;

                    
                            criaGrafico(objeto.casasDecimais);
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
            BoletimCRULFModel.dthInicio.setHours(0);
            BoletimCRULFModel.dthInicio.setMinutes(0);
            BoletimCRULFModel.dthInicio.setSeconds(0);

            BoletimCRULFModel.dataInicioDiaGrafico.setHours(0);
            BoletimCRULFModel.dataInicioDiaGrafico.setMinutes(0);
            BoletimCRULFModel.dataInicioDiaGrafico.setSeconds(0);

            BoletimCRULFModel.dataFimDiaGrafico.setHours(0);
            BoletimCRULFModel.dataFimDiaGrafico.setMinutes(0);
            BoletimCRULFModel.dataFimDiaGrafico.setSeconds(0);

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
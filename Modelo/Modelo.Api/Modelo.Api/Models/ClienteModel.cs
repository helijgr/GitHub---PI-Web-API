using IHM.Log;
using IHM.ResourcesObjects;
using Modelo.BusinessRules;
using Modelo.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using Modelo.BusinessObjects;

namespace Modelo.Api.Models
{
    public class ClienteModel
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public static Resposta CarregarEstrutura(string nomeUsuario, string relatorioSelecionado)
        {
            Resposta resposta = new Resposta();

            String pasta = System.Configuration.ConfigurationManager.AppSettings["PastaConfiguracao"].ToString();
            String arquivo = System.Configuration.ConfigurationManager.AppSettings[relatorioSelecionado].ToString();
            String caminhoCompleto = pasta+ "\\" + arquivo;
            
            //String arquivo = @"C:\Klabin";

            try
            {
                // Verifica existencia da pasta leitura
                //if (System.IO.Directory.Exists(pasta))
                //{

                    // Obtem os nomes dos arquivos da pasta leitura
                    String[] files = System.IO.Directory.GetFiles(pasta);

                    // Percorre todos os arquivos da pasta
                    //foreach (String sourceFile in files)
                    //{
                        // Recupera o nome do arquivo
                        String nomeArquivo = Path.GetFileName(caminhoCompleto);

                        String line;
                        List<DadosRelatorio> linesToPIMS = new List<DadosRelatorio>();

                        // Lê o arquivo
                        System.IO.StreamReader file = new System.IO.StreamReader(caminhoCompleto);
                        while ((line = file.ReadLine()) != null && line != String.Empty)
                        {
                            String[] lineSplited = line.Split(';');

                            DadosRelatorio dados = new DadosRelatorio();
                            dados.elemento = lineSplited[0];
                            dados.grupo = lineSplited[1];
                            dados.subGrupo = lineSplited[2];
                            dados.uom = lineSplited[3];
                            dados.tipoRelatorio = lineSplited[4];
                            dados.tipoGrafico = lineSplited[5];
                            dados.tag = lineSplited[6];
                            dados.filtroExpressao = lineSplited[7];
                            dados.tipoCalculo = lineSplited[8];
                            dados.totalizadorDia = lineSplited[9];
                            dados.totalizadorDiaAnt = lineSplited[10];
                            dados.totalizadorMes = lineSplited[11];
                            dados.totalizadorMesAnt = lineSplited[12];
                            dados.minimo = lineSplited[13];
                            dados.meta = lineSplited[14];
                            dados.maximo = lineSplited[15];
                            dados.casasDecimais = "2";//lineSplited[16];

                            linesToPIMS.Add(dados);
                        }
                        resposta.Dados = linesToPIMS;
                        resposta.Status = true;
                        file.Close();
                    //}
                //}
                //else
                //{
                //    throw new Exception("Pasta " + arquivo + " não existe");
                //}
            }
            catch (Exception ex)
            {
                IHM.Log.Xml.TraceLog.LogEvent(ex.Message, IHM.Log.Xml.TraceLog.TipoLog.Erro);
                resposta.Status = false;
                resposta.Mensagem = ex.Message;
            }
            return resposta;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="exemplo1"></param>
        /// <param name="exemplo2"></param>
        /// <returns></returns>
        public static Resposta AtualizarCliente()
        {
            Resposta resposta = new Resposta();

            try
            {
                RegraExemplo.ExecutaPrimeiraRegraExemplo();

                resposta.Status = true;
            }
            catch (Exception ex)
            {
                IHM.Log.Xml.TraceLog.LogEvent(ex.Message, IHM.Log.Xml.TraceLog.TipoLog.Erro);
                resposta.Status = false;
                resposta.Mensagem = ex.Message;
            }
            return resposta;
        }








    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.BusinessObjects
{
    public class DadosRelatorio
    {
        public string elemento { get; set; }
        public string grupo { get; set; }
        public string subGrupo { get; set; }
        public string uom { get; set; }
        public string tipoRelatorio { get; set; }
        public string tipoGrafico { get; set; }
        public string tag { get; set; }
        public string filtroExpressao { get; set; }
        public string tipoCalculo { get; set; }
        public string totalizadorDia { get; set; }
        public string totalizadorDiaAnt { get; set; }
        public string totalizadorMes { get; set; }
        public string totalizadorMesAnt { get; set; }
        public string minimo { get; set; }
        public string meta { get; set; }
        public string maximo { get; set; }
        public string casasDecimais { get; set; }
    }
}

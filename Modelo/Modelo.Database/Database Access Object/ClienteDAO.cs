using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Database
{
    public class ClienteDAO
    {
        public int Id { get; set; }
        public string NomeCliente { get; set; }
        public string CodigoCliente { get; set; }
        public DateTime DataCriacaoCliente { get; set; }
    }
}

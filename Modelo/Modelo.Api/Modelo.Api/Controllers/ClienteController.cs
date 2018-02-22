using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using IHM.ResourcesObjects;
using IHM.Log;
using Modelo.Api.Models;
using Modelo.Database;
using System.Web;

namespace Modelo.Api.Controllers
{
    [RoutePrefix("api/cliente")]
    public class ClienteController : ApiController
    {
        public static string format = "dd/MM/yyyy HH:mm:ss";
        public IsoDateTimeConverter dateTimeConverter = new IsoDateTimeConverter { DateTimeFormat = format };
        
        [HttpGet]
        [Route(nameof(ClienteController.CarregarEstrutura))]
        public object CarregarEstrutura(string relatorioSelecionado)
        {
            return ClienteModel.CarregarEstrutura(User.Identity.Name, relatorioSelecionado);
        }

        [HttpPost]
        [Route(nameof(ClienteController.AtualizarCliente))]
        public object AtualizarCliente([FromBody] JObject data)
        {
            //string exemplo1 = string.Empty;
            //exemplo1 = data.GetValue("nome").ToString();
            
            ClienteDAO exemplo2 = new ClienteDAO();
            exemplo2 = JsonConvert.DeserializeObject<ClienteDAO>(data.GetValue("cliente").ToString(), dateTimeConverter);

            return ClienteModel.AtualizarCliente();
        }
        
    }
}

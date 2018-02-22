using IHM.Log;
using IHM.Log.Xml;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Modelo.Service
{
    public partial class Service1 : ServiceBase
    {
        private int _runtimeFrequency;
        private bool _continueExecution = true;

        public Service1()
        {
            InitializeComponent();

            // Define cultura da thread para inglês
            System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("en-us");
        }

        static void Main()
        {

            #if (!DEBUG)            
                ServiceBase[] ServicesToRun;
                ServicesToRun = new ServiceBase[]
                {
                    new Service1()
                };
                ServiceBase.Run(ServicesToRun);
            #else
                Service1 myServ = new Service1();
                myServ.OnStart(new string[] { });
                // here Process is my Service function
                // that will run when my service onstart is call
                // you need to call your own method or function name here instead of Process();
            #endif
            
        }
        
        protected override void OnStart(string[] args)
        {
            try
            {
                _runtimeFrequency = Int32.Parse(ConfigurationManager.AppSettings["RuntimeFrequency"]);

                while (_continueExecution)
                {
                    try
                    {
                        Rotina.executaRotina();

                        IHM.Log.Xml.TraceLog.LogEvent("Rotina Executada", IHM.Log.Xml.TraceLog.TipoLog.Informacao);
                        System.Threading.Thread.Sleep(TimeSpan.FromSeconds(_runtimeFrequency));
                    }
                    catch(Exception ex)
                    {
                        IHM.Log.Xml.TraceLog.LogEvent(ex.Message, IHM.Log.Xml.TraceLog.TipoLog.Erro);
                    }
                }
            }   
            catch(Exception ex)
            {
                IHM.Log.Xml.TraceLog.LogEvent(ex.Message, IHM.Log.Xml.TraceLog.TipoLog.Erro);
            }               
        }

        protected override void OnStop()
        {
        }
    }
}

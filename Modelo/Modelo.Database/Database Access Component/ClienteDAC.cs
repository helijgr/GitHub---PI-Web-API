using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Modelo.Database
{
    public static class ClienteDAC
    {        
        public static string GetSqlConnection()
        {
            return System.Configuration.ConfigurationManager.AppSettings["SqlConnectionString"].ToString();
        }


        //public static DataSet getAllClientes()
        //{
        //    string sql = @" Select *
        //                    From TbCliente";
        //    DataSet ds = new DataSet();
        //    SqlConnection conn = new SqlConnection(GetSqlConnection());
        //    SqlDataAdapter da = new SqlDataAdapter(sql, conn);
        //    da.Fill(ds);
        //    conn.Close();
        //    conn.Dispose();
        //    da.Dispose();
        //    return ds;
        //}

        public static List<ClienteDAO> GetAllClientes()
        {
            List<ClienteDAO> clientesDao = new List<ClienteDAO>();

            using (SqlConnection conn = new SqlConnection(GetSqlConnection()))
            {
                conn.Open();

                string sql = @" Select *
                                From TbCliente";

                var cmd = new SqlCommand(sql, conn);

                //cmd.Parameters.AddWithValue("@id", id);

                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    while (rdr.Read())
                    {
                        var clienteDao = new ClienteDAO();
                        clienteDao.Id = Convert.ToInt32(rdr["Id"]);
                        clienteDao.NomeCliente = rdr["NomeCliente"].ToString();
                        clienteDao.CodigoCliente = rdr["CodigoCliente"].ToString();
                        clienteDao.DataCriacaoCliente = Convert.ToDateTime(rdr["DataCriacaoCliente"]);

                        clientesDao.Add(clienteDao);
                    }
                }
            }

            return clientesDao;
        }

    }
}

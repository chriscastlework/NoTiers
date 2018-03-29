using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using CustomLogic.Core.Models;
using CustomLogic.SchemaBuilder.MicrosoftSQL.Helpers;
using CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels;

namespace CustomLogic.SchemaBuilder.MicrosoftSQL
{
    public class GetMicrosoftDatabaseSchemaDetails
    {


        public Response<List<ModelInfo>> GetTableDefinition(string connectionString, string[] requiredTables)
        {
            var result = new Response<List<ModelInfo>>();
            try
            {


                List<ModelInfo> domainModelInfoList = CreateDomainModelInfo(connectionString, requiredTables);

                Parallel.ForEach(domainModelInfoList, (domainModelInfo) =>
                {
                    //foreach (var domainModelInfo in domainModelInfoList)
                    //{

                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        SqlDataAdapter adapter = new SqlDataAdapter();

                        //foreach (var domainModelInfo in domainModelInfoList)
                        //{
                        if (requiredTables == null || requiredTables.Contains(domainModelInfo.TableName.ToLower()))
                        {
                            try
                            {
                                DataSet tableDs = new DataSet();
                                string tableSql = $"sp_help {domainModelInfo.TableName}";
                                connection.Open();
                                var command = new SqlCommand(tableSql, connection);
                                adapter.SelectCommand = command;
                                adapter.Fill(tableDs);
                                adapter.Dispose();
                                command.Dispose();
                                connection.Close();
                                if (tableDs.Tables.Count >= 1)
                                    domainModelInfo.TableInfo = tableDs.Tables[0].DataTableToList<TableInfo>();
                                if (tableDs.Tables.Count >= 2)
                                    domainModelInfo.ColumnInfo = tableDs.Tables[1].DataTableToList<ColumnInfo>();
                                if (tableDs.Tables.Count >= 3)
                                    domainModelInfo.IdentityInfo = tableDs.Tables[2].DataTableToList<IdentityInfo>();
                                if (tableDs.Tables.Count >= 4)
                                    domainModelInfo.RoeGuidInfo = tableDs.Tables[3].DataTableToList<RowGuidInfo>();
                                if (tableDs.Tables.Count >= 5)
                                    domainModelInfo.DataInfo = tableDs.Tables[4].DataTableToList<DataInfo>();
                                if (tableDs.Tables.Count >= 6)
                                    domainModelInfo.IndexInfo = tableDs.Tables[5].DataTableToList<IndexInfo>();
                                if (tableDs.Tables.Count >= 7)
                                    domainModelInfo.ConstraintInfo = tableDs.Tables[6].DataTableToList<ConstraintInfo>();
                                if (tableDs.Tables.Count >= 8)
                                    domainModelInfo.TableFkInfo = tableDs.Tables[7].DataTableToList<TableFkInfo>();
                            }
                            catch (Exception e)
                            {
                                result.LogError(e.Message);
                            }
                            finally
                            {
                                connection.Close();
                            }

                        }

                    }


                    result.Data = domainModelInfoList;
                //} normal foreach
                });
            }
            catch (Exception e)
            {
                result.Success = false;
                result.LogError(e.Message);
            }

            return result;
        }

        public List<ModelInfo> CreateDomainModelInfo(string connectionString, string[] requiredTables)
        {
            List<ModelInfo> domainModelInfoList = new List<ModelInfo>();
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                DataTable table = connection.GetSchema("Tables");
                connection.Close();

                foreach (DataRow row in table.Rows)
                {
                    foreach (DataColumn col in table.Columns)
                    {
                        if (col.ColumnName == "TABLE_NAME")
                        {
                            if (requiredTables == null || requiredTables.Contains(row[col].ToString().ToLower()))
                            {
                                domainModelInfoList.Add(new ModelInfo
                                {
                                    TableName = row[col].ToString(),
                                    ServiceName = row[col].ToString()
                                });
                            }
                        }
                    }
                }


            }
            return domainModelInfoList;
        }

    }
}

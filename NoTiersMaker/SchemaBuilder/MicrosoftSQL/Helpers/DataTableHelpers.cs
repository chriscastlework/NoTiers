using System;
using System.Collections.Generic;
using System.Data;
using System.Net;
using System.Reflection;

namespace CustomLogic.SchemaBuilder.MicrosoftSQL.Helpers
{
    public static class DataTableHelpers
    {

        /// <summary>
        /// Converts a DataTable to a list with generic objects
        /// </summary>
        /// <typeparam name="T">Generic object</typeparam>
        /// <param name="table">DataTable</param>
        /// <returns>List with generic objects</returns>
        public static List<T> DataTableToList<T>(this DataTable table) where T : class, new()
        {
            T obj = new T();
            PropertyInfo[] objectProperties = obj.GetType().GetProperties();

            List<T> list = new List<T>();

            foreach (var row in table.AsEnumerable())
            {
                T newObj = new T();
                foreach (var prop in objectProperties)
                {
                    try
                    {

                        PropertyInfo propertyInfo = newObj.GetType().GetProperty(prop.Name);
                        string propName = prop.Name;

                        // Dynamically load in special types
                        switch (propName)
                        {
                            case "IncludeInView":
                                continue;
                            case "TableIsReferencedByForeignKey":
                                propName = "Table Is Referenced By Foreign Key";
                                break;
                            case "NotForReplication":
                                propName = "Not For Replication";
                                break;
                            case "ColumnNameInView":
                                propName = "Column_name";
                                break;
                            case "TrimTriallingBlanks":
                                continue;
                        }

                        propertyInfo.SetValue(newObj, Convert.ChangeType(row[propName], propertyInfo.PropertyType), null);
                    }
                    catch
                    {
                        continue;
                    }
                }

                list.Add(newObj);

            }

            return list;
        }

    }
}

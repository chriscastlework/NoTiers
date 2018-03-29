using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels;

namespace CustomLogic.Templates.Angular
{
    public static class NgHelp
    {
        public static string GetTableSort(ColumnInfo columnInfo)
        {
            return " sortable=\"\'"+ columnInfo.ColumnNameInView+"\'\""; 
        }

        public static string GetTableFilter(ColumnInfo columnInfo)
        {
            return "filter=\"{" + columnInfo.ColumnNameInView + ": 'text'}\"";
        }
    }
}

using System;
using CustomLogic.StringHelpers;

namespace CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels
{

    public class ColumnInfo
    {
        public ColumnInfo()
        {
            IncludeInView = true;
        }

        private string _columnName;

        public string ColumnNameInView { get; set; }

        public bool IncludeInView { get; set; }

        public string TT_Column_name()
        {
            if (Column_name == "ID")
            {
                return "Id";
            }
            return Column_name.FirstCharToUpper();
        }
        
        public string Column_name
        {
            get
            {
                return _columnName;
            }
            set
            {
                _columnName = value;
                if(string.IsNullOrEmpty(ColumnNameInView))
                {
                      ColumnNameInView = value;
                }
            }
        }

        public string Type { get; set; }
        public string Computed { get; set; }
        public string Length { get; set; }

        public string Prec { get; set; }

        public string Scale { get; set; }

        public string Nullable { get; set; }

        public string TrimTriallingBlanks { get; set; }

        public string FixedLenNullInSource { get; set; }

        public string Collation { get; set; }


        public string GetCsType()
        {
            var type = CsType();
            if (type.ToLower() == "string")
            {
                return type;
            }
            if (Nullable.ToLower() == "yes")
            {
                return type + "?";
            }
            else
            {
                return type;
            }
        }


        public string CsType()
        {
            
            switch (Type.ToLower())
            {
                case "gigint":
                    return "long";

                case "binary":
                case "mediatypenames.image":
                case "timestamp":
                case "varbinary":
                    return "byte[]";

                case "bit":
                    return "bool";

                case "char":
                case "nchar":
                case "ntext":
                case "nvarchar":
                case "sysname":
                case "mediatypenames.Text":
                case "varchar":
                case "mml":
                    return "string";

                case "datetime":
                case "smalldatetime":
                case "date":
                case "time":
                case "datetime2":
                    return "DateTime";

                case "decimal":
                case "money":
                case "smallmoney":
                    return "decimal";

                case "float":
                    return "double";
                case "bigint":
                case "int":
                    return "int";

                case "real":
                    return "float";

                case "uniqueidentifier":
                    return "Guid";

                case "smallint":
                    return "short";

                case "tinyint":
                    return "byte";

                case "variant":
                case "udt":
                    return "object";

                case "structured":
                    return "datatable";

                case "datetimeoffset":
                    return "datetimeoffset";

                default:
                    return "string";
                    throw new NotImplementedException();
            }

        }
    }
}
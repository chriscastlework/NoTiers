using System.Collections.Generic;
using System.Linq;
using CustomLogic.StringHelpers;

namespace CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels
{
    public class ModelInfo
    {
    
        private string _viewModelName;
        private string _tableName;

        public bool Required { get; set; }

        public ModelInfo()
        {
           
          //  DataColumns = new List<DataColumn>();
        }

        /// <summary>
        /// True if domain model false if this is a view model
        /// </summary>
        public bool DomainModel { get; set; }

        public string TT_TableName()
        {
            return TableName.Pluralize(false).FirstCharToUpper().Replace("_","");
        }

        public string TT_PrimaryKey()
        {
            return "Id";
        }

        public string TT_PrimaryKeyType()
        {
            return "Guid";
        }

        public string TT_ViewModelName()
        {
            return ViewModelName.FirstCharToUpper().Replace("_", "");
        }

        public string TableName
        {
            get
            {
                return _tableName;
            }
            set
            {
                _tableName = value;
            }
        }

        public string ViewModelName
        {
            get
            {
                if (string.IsNullOrEmpty(_viewModelName))
                {
                    return TableName;
                }
                return _viewModelName;
            }
            set { _viewModelName = value; }
        }

        public string ServiceName { get; set; }

      //  public  List<DataColumn> DataColumns { get; set; }
        public List<TableInfo> TableInfo { get; set; }
        public List<ColumnInfo> ColumnInfo { get; set; }
        public List<IdentityInfo> IdentityInfo { get; set; }
        public List<RowGuidInfo> RoeGuidInfo { get; set; }
        public List<DataInfo> DataInfo { get; set; }
        public List<IndexInfo> IndexInfo { get; set; }
        public List<ConstraintInfo> ConstraintInfo { get; set; }
        public List<TableFkInfo> TableFkInfo { get; set; }
    }
}

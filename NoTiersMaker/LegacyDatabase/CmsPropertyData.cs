// <auto-generated>
// ReSharper disable ConvertPropertyToExpressionBody
// ReSharper disable DoNotCallOverridableMethodsInConstructor
// ReSharper disable InconsistentNaming
// ReSharper disable PartialMethodWithSinglePart
// ReSharper disable PartialTypeWithSinglePart
// ReSharper disable RedundantNameQualifier
// ReSharper disable RedundantOverridenMember
// ReSharper disable UseNameofExpression
// TargetFrameworkVersion = 4.52
#pragma warning disable 1591    //  Ignore "Missing XML Comment" warning


namespace CustomLogic.LegacyDatabase
{

    // cmsPropertyData
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CmsPropertyData
    {
        public int Id { get; set; } // id (Primary key)
        public int ContentNodeId { get; set; } // contentNodeId
        public System.Guid? VersionId { get; set; } // versionId
        public int Propertytypeid { get; set; } // propertytypeid
        public int? DataInt { get; set; } // dataInt
        public decimal? DataDecimal { get; set; } // dataDecimal
        public System.DateTime? DataDate { get; set; } // dataDate
        public string DataNvarchar { get; set; } // dataNvarchar (length: 500)
        public string DataNtext { get; set; } // dataNtext (length: 1073741823)

        // Foreign keys
        public virtual CmsPropertyType CmsPropertyType { get; set; } // FK_cmsPropertyData_cmsPropertyType_id
        public virtual UmbracoNode UmbracoNode { get; set; } // FK_cmsPropertyData_umbracoNode_id

        public CmsPropertyData()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
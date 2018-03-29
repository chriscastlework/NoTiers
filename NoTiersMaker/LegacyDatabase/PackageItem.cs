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

    // PackageItems
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class PackageItem
    {
        public int Id { get; set; } // Id (Primary key)
        public int ItemId { get; set; } // ItemId
        public int ItemType { get; set; } // ItemType
        public System.Guid? PackageId { get; set; } // Package_Id

        // Foreign keys
        public virtual IntegrationPackage IntegrationPackage { get; set; } // FK_dbo.PackageItems_dbo.IntegrationPackages_Package_Id

        public PackageItem()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
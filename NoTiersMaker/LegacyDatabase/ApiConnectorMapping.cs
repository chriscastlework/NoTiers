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

    // ApiConnectors
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class ApiConnectorMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ApiConnector>
    {
        public ApiConnectorMapping()
            : this("dbo")
        {
        }

        public ApiConnectorMapping(string schema)
        {
            ToTable("ApiConnectors", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.Name).HasColumnName(@"Name").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.ConnectorEndPoint).HasColumnName(@"ConnectorEndPoint").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.ApiEndPoint).HasColumnName(@"ApiEndPoint").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.ExternalCodeSetupEndPoint).HasColumnName(@"ExternalCodeSetupEndPoint").HasColumnType("nvarchar(max)").IsOptional();
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>

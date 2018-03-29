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

    // umbracoLog
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UmbracoLogMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<UmbracoLog>
    {
        public UmbracoLogMapping()
            : this("dbo")
        {
        }

        public UmbracoLogMapping(string schema)
        {
            ToTable("umbracoLog", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.UserId).HasColumnName(@"userId").HasColumnType("int").IsRequired();
            Property(x => x.NodeId).HasColumnName(@"NodeId").HasColumnType("int").IsRequired();
            Property(x => x.Datestamp).HasColumnName(@"Datestamp").HasColumnType("datetime").IsRequired();
            Property(x => x.LogHeader).HasColumnName(@"logHeader").HasColumnType("nvarchar").IsRequired().HasMaxLength(50);
            Property(x => x.LogComment).HasColumnName(@"logComment").HasColumnType("nvarchar").IsOptional().HasMaxLength(4000);
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
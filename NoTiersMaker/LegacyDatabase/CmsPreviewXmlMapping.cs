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

    // cmsPreviewXml
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CmsPreviewXmlMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<CmsPreviewXml>
    {
        public CmsPreviewXmlMapping()
            : this("dbo")
        {
        }

        public CmsPreviewXmlMapping(string schema)
        {
            ToTable("cmsPreviewXml", schema);
            HasKey(x => new { x.NodeId, x.VersionId });

            Property(x => x.NodeId).HasColumnName(@"nodeId").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None);
            Property(x => x.VersionId).HasColumnName(@"versionId").HasColumnType("uniqueidentifier").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None);
            Property(x => x.Timestamp).HasColumnName(@"timestamp").HasColumnType("datetime").IsRequired();
            Property(x => x.Xml).HasColumnName(@"xml").HasColumnType("ntext").IsRequired().IsMaxLength();

            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>

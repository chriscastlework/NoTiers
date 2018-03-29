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

    // cmsContentXml
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CmsContentXmlMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<CmsContentXml>
    {
        public CmsContentXmlMapping()
            : this("dbo")
        {
        }

        public CmsContentXmlMapping(string schema)
        {
            ToTable("cmsContentXml", schema);
            HasKey(x => x.NodeId);

            Property(x => x.NodeId).HasColumnName(@"nodeId").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None);
            Property(x => x.Xml).HasColumnName(@"xml").HasColumnType("ntext").IsRequired().IsMaxLength();

            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
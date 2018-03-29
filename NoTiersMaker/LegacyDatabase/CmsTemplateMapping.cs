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

    // cmsTemplate
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class CmsTemplateMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<CmsTemplate>
    {
        public CmsTemplateMapping()
            : this("dbo")
        {
        }

        public CmsTemplateMapping(string schema)
        {
            ToTable("cmsTemplate", schema);
            HasKey(x => x.Pk);

            Property(x => x.Pk).HasColumnName(@"pk").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.NodeId).HasColumnName(@"nodeId").HasColumnType("int").IsRequired();
            Property(x => x.Alias).HasColumnName(@"alias").HasColumnType("nvarchar").IsOptional().HasMaxLength(100);
            Property(x => x.Design).HasColumnName(@"design").HasColumnType("ntext").IsRequired().IsMaxLength();

            // Foreign keys
            HasRequired(a => a.UmbracoNode).WithMany(b => b.CmsTemplates).HasForeignKey(c => c.NodeId).WillCascadeOnDelete(false); // FK_cmsTemplate_umbracoNode
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>

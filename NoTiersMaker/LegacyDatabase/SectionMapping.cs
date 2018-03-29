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

    // Sections
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class SectionMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Section>
    {
        public SectionMapping()
            : this("dbo")
        {
        }

        public SectionMapping(string schema)
        {
            ToTable("Sections", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.Name).HasColumnName(@"Name").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Description).HasColumnName(@"Description").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.StageId).HasColumnName(@"StageId").HasColumnType("int").IsRequired();
            Property(x => x.OrderInStage).HasColumnName(@"OrderInStage").HasColumnType("int").IsRequired();

            // Foreign keys
            HasRequired(a => a.Stage).WithMany(b => b.Sections).HasForeignKey(c => c.StageId); // FK_dbo.Sections_dbo.Stages_StageId
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>

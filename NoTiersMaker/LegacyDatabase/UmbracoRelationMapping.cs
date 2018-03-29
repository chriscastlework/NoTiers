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

    // umbracoRelation
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UmbracoRelationMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<UmbracoRelation>
    {
        public UmbracoRelationMapping()
            : this("dbo")
        {
        }

        public UmbracoRelationMapping(string schema)
        {
            ToTable("umbracoRelation", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.ParentId).HasColumnName(@"parentId").HasColumnType("int").IsRequired();
            Property(x => x.ChildId).HasColumnName(@"childId").HasColumnType("int").IsRequired();
            Property(x => x.RelType).HasColumnName(@"relType").HasColumnType("int").IsRequired();
            Property(x => x.Datetime).HasColumnName(@"datetime").HasColumnType("datetime").IsRequired();
            Property(x => x.Comment).HasColumnName(@"comment").HasColumnType("nvarchar").IsRequired().HasMaxLength(1000);

            // Foreign keys
            HasRequired(a => a.Child).WithMany(b => b.Child).HasForeignKey(c => c.ChildId).WillCascadeOnDelete(false); // FK_umbracoRelation_umbracoNode1
            HasRequired(a => a.Parent).WithMany(b => b.UmbracoRelations_ParentId).HasForeignKey(c => c.ParentId).WillCascadeOnDelete(false); // FK_umbracoRelation_umbracoNode
            HasRequired(a => a.UmbracoRelationType).WithMany(b => b.UmbracoRelations).HasForeignKey(c => c.RelType).WillCascadeOnDelete(false); // FK_umbracoRelation_umbracoRelationType_id
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>

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

    // umbracoUser2NodePermission
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UmbracoUser2NodePermissionMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<UmbracoUser2NodePermission>
    {
        public UmbracoUser2NodePermissionMapping()
            : this("dbo")
        {
        }

        public UmbracoUser2NodePermissionMapping(string schema)
        {
            ToTable("umbracoUser2NodePermission", schema);
            HasKey(x => new { x.UserId, x.NodeId, x.Permission });

            Property(x => x.UserId).HasColumnName(@"userId").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None);
            Property(x => x.NodeId).HasColumnName(@"nodeId").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None);
            Property(x => x.Permission).HasColumnName(@"permission").HasColumnType("nvarchar").IsRequired().HasMaxLength(255).HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.None);

            // Foreign keys
            HasRequired(a => a.UmbracoNode).WithMany(b => b.UmbracoUser2NodePermission).HasForeignKey(c => c.NodeId).WillCascadeOnDelete(false); // FK_umbracoUser2NodePermission_umbracoNode_id
            HasRequired(a => a.UmbracoUser).WithMany(b => b.UmbracoUser2NodePermission).HasForeignKey(c => c.UserId).WillCascadeOnDelete(false); // FK_umbracoUser2NodePermission_umbracoUser_id
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
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

    // UserFolders
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class Coaching_UserFolderMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Coaching_UserFolder>
    {
        public Coaching_UserFolderMapping()
            : this("Coaching")
        {
        }

        public Coaching_UserFolderMapping(string schema)
        {
            ToTable("UserFolders", schema);
            HasKey(x => x.UserFolderId);

            Property(x => x.UserFolderId).HasColumnName(@"UserFolderID").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.UserFolderName).HasColumnName(@"UserFolderName").HasColumnType("nvarchar(max)").IsRequired();
            Property(x => x.UserId).HasColumnName(@"UserID").HasColumnType("int").IsRequired();
            Property(x => x.SortOrder).HasColumnName(@"SortOrder").HasColumnType("int").IsOptional();
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>

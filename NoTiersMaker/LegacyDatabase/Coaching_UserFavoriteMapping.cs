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

    // UserFavorites
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class Coaching_UserFavoriteMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Coaching_UserFavorite>
    {
        public Coaching_UserFavoriteMapping()
            : this("Coaching")
        {
        }

        public Coaching_UserFavoriteMapping(string schema)
        {
            ToTable("UserFavorites", schema);
            HasKey(x => x.UserFavoriteId);

            Property(x => x.UserFavoriteId).HasColumnName(@"UserFavoriteID").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.UserId).HasColumnName(@"UserID").HasColumnType("int").IsRequired();
            Property(x => x.AssetItemId).HasColumnName(@"AssetItemID").HasColumnType("int").IsRequired();
            Property(x => x.FavoritesFolderId).HasColumnName(@"FavoritesFolderID").HasColumnType("int").IsOptional();
            Property(x => x.SortOrder).HasColumnName(@"SortOrder").HasColumnType("int").IsOptional();

            // Foreign keys
            HasOptional(a => a.Coaching_UserFolder).WithMany(b => b.Coaching_UserFavorites).HasForeignKey(c => c.FavoritesFolderId).WillCascadeOnDelete(false); // FK_dbo.UserFavorites_dbo.UserFolders_FavoritesFolderID
            HasRequired(a => a.Coaching_Asset).WithMany(b => b.Coaching_UserFavorites).HasForeignKey(c => c.AssetItemId); // FK_dbo.UserFavorites_Coaching.Assets_AssetItemID
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>

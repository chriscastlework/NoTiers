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

    // DealContacts
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class DealContactMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<DealContact>
    {
        public DealContactMapping()
            : this("dbo")
        {
        }

        public DealContactMapping(string schema)
        {
            ToTable("DealContacts", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.DealId).HasColumnName(@"DealId").HasColumnType("int").IsOptional();
            Property(x => x.ContactId).HasColumnName(@"ContactId").HasColumnType("int").IsOptional();
            Property(x => x.IsBuyingInfluence).HasColumnName(@"IsBuyingInfluence").HasColumnType("bit").IsOptional();
            Property(x => x.IsGoalKeeper).HasColumnName(@"IsGoalKeeper").HasColumnType("bit").IsOptional();
            Property(x => x.PictureUrl).HasColumnName(@"PictureURL").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.LinkedInProfileUrl).HasColumnName(@"LinkedInProfileURL").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Support).HasColumnName(@"Support").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Influence).HasColumnName(@"Influence").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Access).HasColumnName(@"Access").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Role).HasColumnName(@"Role").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.X).HasColumnName(@"X").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Y).HasColumnName(@"Y").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Manager).HasColumnName(@"Manager").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.Influencees).HasColumnName(@"Influencees").HasColumnType("nvarchar(max)").IsOptional();
            Property(x => x.DealContactRoleId).HasColumnName(@"DealContactRoleId").HasColumnType("int").IsOptional();
            HasMany(t => t.DealContactRoles).WithMany(t => t.DealContacts).Map(m =>
            {
                m.ToTable("DealContactRoleDealContacts", "dbo");
                m.MapLeftKey("DealContact_Id");
                m.MapRightKey("DealContactRole_Id");
            });
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>

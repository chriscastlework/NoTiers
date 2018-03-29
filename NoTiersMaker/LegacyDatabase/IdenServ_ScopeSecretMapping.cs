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

    // ScopeSecrets
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class IdenServ_ScopeSecretMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<IdenServ_ScopeSecret>
    {
        public IdenServ_ScopeSecretMapping()
            : this("IdenServ")
        {
        }

        public IdenServ_ScopeSecretMapping(string schema)
        {
            ToTable("ScopeSecrets", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"Id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.Description).HasColumnName(@"Description").HasColumnType("nvarchar").IsOptional().HasMaxLength(1000);
            Property(x => x.Expiration).HasColumnName(@"Expiration").HasColumnType("datetimeoffset").IsOptional();
            Property(x => x.Type).HasColumnName(@"Type").HasColumnType("nvarchar").IsOptional().HasMaxLength(250);
            Property(x => x.Value).HasColumnName(@"Value").HasColumnType("nvarchar").IsRequired().HasMaxLength(250);
            Property(x => x.ScopeId).HasColumnName(@"Scope_Id").HasColumnType("int").IsOptional();

            // Foreign keys
            HasOptional(a => a.IdenServ_Scope).WithMany(b => b.IdenServ_ScopeSecrets).HasForeignKey(c => c.ScopeId).WillCascadeOnDelete(false); // FK_IdenServ.ScopeSecrets_IdenServ.Scopes_Scope_Id
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>

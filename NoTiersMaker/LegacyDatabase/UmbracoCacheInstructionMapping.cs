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

    // umbracoCacheInstruction
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class UmbracoCacheInstructionMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<UmbracoCacheInstruction>
    {
        public UmbracoCacheInstructionMapping()
            : this("dbo")
        {
        }

        public UmbracoCacheInstructionMapping(string schema)
        {
            ToTable("umbracoCacheInstruction", schema);
            HasKey(x => x.Id);

            Property(x => x.Id).HasColumnName(@"id").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.UtcStamp).HasColumnName(@"utcStamp").HasColumnType("datetime").IsRequired();
            Property(x => x.JsonInstruction).HasColumnName(@"jsonInstruction").HasColumnType("ntext").IsRequired().IsMaxLength();
            Property(x => x.Originated).HasColumnName(@"originated").HasColumnType("nvarchar").IsRequired().HasMaxLength(500);
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>

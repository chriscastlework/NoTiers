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

    // Channels
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class Coaching_ChannelMapping : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Coaching_Channel>
    {
        public Coaching_ChannelMapping()
            : this("Coaching")
        {
        }

        public Coaching_ChannelMapping(string schema)
        {
            ToTable("Channels", schema);
            HasKey(x => x.ChannelId);

            Property(x => x.ChannelId).HasColumnName(@"ChannelID").HasColumnType("int").IsRequired().HasDatabaseGeneratedOption(System.ComponentModel.DataAnnotations.Schema.DatabaseGeneratedOption.Identity);
            Property(x => x.BroadcasterId).HasColumnName(@"BroadcasterID").HasColumnType("int").IsRequired();
            Property(x => x.ChannelName).HasColumnName(@"ChannelName").HasColumnType("nvarchar(max)").IsRequired();
            Property(x => x.IsActive).HasColumnName(@"IsActive").HasColumnType("bit").IsRequired();
            Property(x => x.ImageFileName).HasColumnName(@"ImageFileName").HasColumnType("nvarchar").IsOptional().HasMaxLength(50);
            Property(x => x.DeletedDate).HasColumnName(@"DeletedDate").HasColumnType("datetime2").IsOptional();

            // Foreign keys
            HasRequired(a => a.Coaching_Broadcaster).WithMany(b => b.Coaching_Channels).HasForeignKey(c => c.BroadcasterId); // FK_Coaching.Channels_Coaching.Broadcasters_BroadcasterID
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
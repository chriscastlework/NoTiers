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
    public partial class Coaching_Channel
    {
        public int ChannelId { get; set; } // ChannelID (Primary key)
        public int BroadcasterId { get; set; } // BroadcasterID
        public string ChannelName { get; set; } // ChannelName
        public bool IsActive { get; set; } // IsActive
        public string ImageFileName { get; set; } // ImageFileName (length: 50)
        public System.DateTime? DeletedDate { get; set; } // DeletedDate

        // Reverse navigation
        public virtual System.Collections.Generic.ICollection<Coaching_Asset> Coaching_Assets { get; set; } // Assets.FK_Coaching.Assets_Coaching.Channels_ChannelID
        public virtual System.Collections.Generic.ICollection<Coaching_Program> Coaching_Programs { get; set; } // Programs.FK_Coaching.Programs_Coaching.Channels_ChannelID

        // Foreign keys
        public virtual Coaching_Broadcaster Coaching_Broadcaster { get; set; } // FK_Coaching.Channels_Coaching.Broadcasters_BroadcasterID

        public Coaching_Channel()
        {
            Coaching_Assets = new System.Collections.Generic.List<Coaching_Asset>();
            Coaching_Programs = new System.Collections.Generic.List<Coaching_Program>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
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

    using System.Linq;

    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.27.0.0")]
    public partial class FakeVelocityRocketLegacyContext1 : IVelocityRocketLegacyContext1
    {
        public System.Data.Entity.DbSet<Account> Accounts { get; set; }
        public System.Data.Entity.DbSet<AccountShare> AccountShares { get; set; }
        public System.Data.Entity.DbSet<AcheivedAward> AcheivedAwards { get; set; }
        public System.Data.Entity.DbSet<AddOn> AddOns { get; set; }
        public System.Data.Entity.DbSet<AddOnClaim> AddOnClaims { get; set; }
        public System.Data.Entity.DbSet<AddOnClaimValue> AddOnClaimValues { get; set; }
        public System.Data.Entity.DbSet<AddOnCost> AddOnCosts { get; set; }
        public System.Data.Entity.DbSet<ApiAuthentication> ApiAuthentications { get; set; }
        public System.Data.Entity.DbSet<ApiConnector> ApiConnectors { get; set; }
        public System.Data.Entity.DbSet<ApiKey> ApiKeys { get; set; }
        public System.Data.Entity.DbSet<ApiTypeImportQueueItem> ApiTypeImportQueueItems { get; set; }
        public System.Data.Entity.DbSet<Attachment> Attachments { get; set; }
        public System.Data.Entity.DbSet<AvailableSlot> AvailableSlots { get; set; }
        public System.Data.Entity.DbSet<Award> Awards { get; set; }
        public System.Data.Entity.DbSet<BuyingProcess> BuyingProcesses { get; set; }
        public System.Data.Entity.DbSet<BuyingProcessStage> BuyingProcessStages { get; set; }
        public System.Data.Entity.DbSet<Coaching_AdminConnectorLog> Coaching_AdminConnectorLogs { get; set; }
        public System.Data.Entity.DbSet<Coaching_AdminEventLog> Coaching_AdminEventLogs { get; set; }
        public System.Data.Entity.DbSet<Coaching_Asset> Coaching_Assets { get; set; }
        public System.Data.Entity.DbSet<Coaching_AssetTag> Coaching_AssetTags { get; set; }
        public System.Data.Entity.DbSet<Coaching_AssetType> Coaching_AssetTypes { get; set; }
        public System.Data.Entity.DbSet<Coaching_Broadcaster> Coaching_Broadcasters { get; set; }
        public System.Data.Entity.DbSet<Coaching_Channel> Coaching_Channels { get; set; }
        public System.Data.Entity.DbSet<Coaching_CoachingUser> Coaching_CoachingUsers { get; set; }
        public System.Data.Entity.DbSet<Coaching_Program> Coaching_Programs { get; set; }
        public System.Data.Entity.DbSet<Coaching_ProgramAsset> Coaching_ProgramAssets { get; set; }
        public System.Data.Entity.DbSet<Coaching_StaTheme> Coaching_StaThemes { get; set; }
        public System.Data.Entity.DbSet<Coaching_Tag> Coaching_Tags { get; set; }
        public System.Data.Entity.DbSet<Coaching_Theme> Coaching_Themes { get; set; }
        public System.Data.Entity.DbSet<Coaching_UserFavorite> Coaching_UserFavorites { get; set; }
        public System.Data.Entity.DbSet<Coaching_UserFolder> Coaching_UserFolders { get; set; }
        public System.Data.Entity.DbSet<Coaching_UserRating> Coaching_UserRatings { get; set; }
        public System.Data.Entity.DbSet<Coaching_UserShare> Coaching_UserShares { get; set; }
        public System.Data.Entity.DbSet<Coaching_UserView> Coaching_UserViews { get; set; }
        public System.Data.Entity.DbSet<ColumnPreference> ColumnPreferences { get; set; }
        public System.Data.Entity.DbSet<Comment> Comments { get; set; }
        public System.Data.Entity.DbSet<Contact> Contacts { get; set; }
        public System.Data.Entity.DbSet<ContactShare> ContactShares { get; set; }
        public System.Data.Entity.DbSet<CountryList> CountryLists { get; set; }
        public System.Data.Entity.DbSet<Currency> Currencies { get; set; }
        public System.Data.Entity.DbSet<CurrencyAmount> CurrencyAmounts { get; set; }
        public System.Data.Entity.DbSet<CustomField> CustomFields { get; set; }
        public System.Data.Entity.DbSet<CustomFieldGroup> CustomFieldGroups { get; set; }
        public System.Data.Entity.DbSet<CustomFieldOption> CustomFieldOptions { get; set; }
        public System.Data.Entity.DbSet<CustomFieldTypeGroup> CustomFieldTypeGroups { get; set; }
        public System.Data.Entity.DbSet<CustomFieldValidation> CustomFieldValidations { get; set; }
        public System.Data.Entity.DbSet<CustomFieldValue> CustomFieldValues { get; set; }
        public System.Data.Entity.DbSet<CustomLinksAndButton> CustomLinksAndButtons { get; set; }
        public System.Data.Entity.DbSet<CustomLinksAndButtonsForRole> CustomLinksAndButtonsForRoles { get; set; }
        public System.Data.Entity.DbSet<CustomLinksApiType> CustomLinksApiTypes { get; set; }
        public System.Data.Entity.DbSet<CustomLinksButtonPlacement> CustomLinksButtonPlacements { get; set; }
        public System.Data.Entity.DbSet<CustomLinksUrl> CustomLinksUrls { get; set; }
        public System.Data.Entity.DbSet<CustomObject> CustomObjects { get; set; }
        public System.Data.Entity.DbSet<CustomObjectFilter> CustomObjectFilters { get; set; }
        public System.Data.Entity.DbSet<CustomObjectFilterField> CustomObjectFilterFields { get; set; }
        public System.Data.Entity.DbSet<CustomObjectRow> CustomObjectRows { get; set; }
        public System.Data.Entity.DbSet<CustomObjectRowField> CustomObjectRowFields { get; set; }
        public System.Data.Entity.DbSet<Deal> Deals { get; set; }
        public System.Data.Entity.DbSet<DealContact> DealContacts { get; set; }
        public System.Data.Entity.DbSet<DealContactRole> DealContactRoles { get; set; }
        public System.Data.Entity.DbSet<DealOrgChart> DealOrgCharts { get; set; }
        public System.Data.Entity.DbSet<DealShare> DealShares { get; set; }
        public System.Data.Entity.DbSet<DealStageHistory> DealStageHistories { get; set; }
        public System.Data.Entity.DbSet<DealStep> DealSteps { get; set; }
        public System.Data.Entity.DbSet<DefaultAddOnInEdition1> DefaultAddOnInEdition1 { get; set; }
        public System.Data.Entity.DbSet<Edition> Editions { get; set; }
        public System.Data.Entity.DbSet<EditionCost> EditionCosts { get; set; }
        public System.Data.Entity.DbSet<EmailConfiguration> EmailConfigurations { get; set; }
        public System.Data.Entity.DbSet<EmailNotification> EmailNotifications { get; set; }
        public System.Data.Entity.DbSet<EmailTemplate> EmailTemplates { get; set; }
        public System.Data.Entity.DbSet<EmailTemplateConfiguration> EmailTemplateConfigurations { get; set; }
        public System.Data.Entity.DbSet<ExchangeRate> ExchangeRates { get; set; }
        public System.Data.Entity.DbSet<ExternalIntegration> ExternalIntegrations { get; set; }
        public System.Data.Entity.DbSet<ExternalIntegrationFieldMapping> ExternalIntegrationFieldMappings { get; set; }
        public System.Data.Entity.DbSet<ExternalIntegrationTypeMapping> ExternalIntegrationTypeMappings { get; set; }
        public System.Data.Entity.DbSet<Feature> Features { get; set; }
        public System.Data.Entity.DbSet<FeatureClaim> FeatureClaims { get; set; }
        public System.Data.Entity.DbSet<Group> Groups { get; set; }
        public System.Data.Entity.DbSet<IdenServ_Client> IdenServ_Clients { get; set; }
        public System.Data.Entity.DbSet<IdenServ_ClientClaim> IdenServ_ClientClaims { get; set; }
        public System.Data.Entity.DbSet<IdenServ_ClientCorsOrigin> IdenServ_ClientCorsOrigins { get; set; }
        public System.Data.Entity.DbSet<IdenServ_ClientCustomGrantType> IdenServ_ClientCustomGrantTypes { get; set; }
        public System.Data.Entity.DbSet<IdenServ_ClientIdPRestriction> IdenServ_ClientIdPRestrictions { get; set; }
        public System.Data.Entity.DbSet<IdenServ_ClientPostLogoutRedirectUri> IdenServ_ClientPostLogoutRedirectUris { get; set; }
        public System.Data.Entity.DbSet<IdenServ_ClientRedirectUri> IdenServ_ClientRedirectUris { get; set; }
        public System.Data.Entity.DbSet<IdenServ_ClientScope> IdenServ_ClientScopes { get; set; }
        public System.Data.Entity.DbSet<IdenServ_ClientSecret> IdenServ_ClientSecrets { get; set; }
        public System.Data.Entity.DbSet<IdenServ_Consent> IdenServ_Consents { get; set; }
        public System.Data.Entity.DbSet<IdenServ_Scope> IdenServ_Scopes { get; set; }
        public System.Data.Entity.DbSet<IdenServ_ScopeClaim> IdenServ_ScopeClaims { get; set; }
        public System.Data.Entity.DbSet<IdenServ_ScopeSecret> IdenServ_ScopeSecrets { get; set; }
        public System.Data.Entity.DbSet<IdenServ_Token> IdenServ_Tokens { get; set; }
        public System.Data.Entity.DbSet<ImportedData> ImportedDatas { get; set; }
        public System.Data.Entity.DbSet<IntegrationPackage> IntegrationPackages { get; set; }
        public System.Data.Entity.DbSet<Invite> Invites { get; set; }
        public System.Data.Entity.DbSet<ItemStep> ItemSteps { get; set; }
        public System.Data.Entity.DbSet<LeadConversion> LeadConversions { get; set; }
        public System.Data.Entity.DbSet<LeadStatu> LeadStatus { get; set; }
        public System.Data.Entity.DbSet<Localization> Localizations { get; set; }
        public System.Data.Entity.DbSet<LogoImage> LogoImages { get; set; }
        public System.Data.Entity.DbSet<MaintenanceSchedule> MaintenanceSchedules { get; set; }
        public System.Data.Entity.DbSet<MeetingVisualiserChartItem> MeetingVisualiserChartItems { get; set; }
        public System.Data.Entity.DbSet<Notification> Notifications { get; set; }
        public System.Data.Entity.DbSet<NotificationField> NotificationFields { get; set; }
        public System.Data.Entity.DbSet<OAuth2Token> OAuth2Token { get; set; }
        public System.Data.Entity.DbSet<Organisation> Organisations { get; set; }
        public System.Data.Entity.DbSet<OrganisationAllowedRole> OrganisationAllowedRoles { get; set; }
        public System.Data.Entity.DbSet<OrganisationSalesObjectView> OrganisationSalesObjectViews { get; set; }
        public System.Data.Entity.DbSet<OrgEmailNotificiationPreference> OrgEmailNotificiationPreferences { get; set; }
        public System.Data.Entity.DbSet<PackageItem> PackageItems { get; set; }
        public System.Data.Entity.DbSet<PasswordResetRequest> PasswordResetRequests { get; set; }
        public System.Data.Entity.DbSet<PickList> PickLists { get; set; }
        public System.Data.Entity.DbSet<PickListOption> PickListOptions { get; set; }
        public System.Data.Entity.DbSet<ReminderTask> ReminderTasks { get; set; }
        public System.Data.Entity.DbSet<Role> Roles { get; set; }
        public System.Data.Entity.DbSet<RoleClaim> RoleClaims { get; set; }
        public System.Data.Entity.DbSet<Rule> Rules { get; set; }
        public System.Data.Entity.DbSet<SalesObjectView> SalesObjectViews { get; set; }
        public System.Data.Entity.DbSet<SalesObjectViewArchive> SalesObjectViewArchives { get; set; }
        public System.Data.Entity.DbSet<SalesObjectViewArchiveItem> SalesObjectViewArchiveItems { get; set; }
        public System.Data.Entity.DbSet<SalesProcess> SalesProcesses { get; set; }
        public System.Data.Entity.DbSet<SalesTrainingCompany> SalesTrainingCompanies { get; set; }
        public System.Data.Entity.DbSet<Search> Searches { get; set; }
        public System.Data.Entity.DbSet<Section> Sections { get; set; }
        public System.Data.Entity.DbSet<SectionCustomLink> SectionCustomLinks { get; set; }
        public System.Data.Entity.DbSet<SideNav> SideNavs { get; set; }
        public System.Data.Entity.DbSet<SideNavItem> SideNavItems { get; set; }
        public System.Data.Entity.DbSet<SideNavSideNavItemLookup> SideNavSideNavItemLookups { get; set; }
        public System.Data.Entity.DbSet<Stage> Stages { get; set; }
        public System.Data.Entity.DbSet<StandardObjectDefinition> StandardObjectDefinitions { get; set; }
        public System.Data.Entity.DbSet<StandardObjectRelationshipDefintion> StandardObjectRelationshipDefintions { get; set; }
        public System.Data.Entity.DbSet<StandardRelationship> StandardRelationships { get; set; }
        public System.Data.Entity.DbSet<Statement> Statements { get; set; }
        public System.Data.Entity.DbSet<StcOrg> StcOrgs { get; set; }
        public System.Data.Entity.DbSet<StcTheme> StcThemes { get; set; }
        public System.Data.Entity.DbSet<Step> Steps { get; set; }
        public System.Data.Entity.DbSet<StepActionFile> StepActionFiles { get; set; }
        public System.Data.Entity.DbSet<StepDocument> StepDocuments { get; set; }
        public System.Data.Entity.DbSet<Subscription> Subscriptions { get; set; }
        public System.Data.Entity.DbSet<SubscriptionAddOn> SubscriptionAddOns { get; set; }
        public System.Data.Entity.DbSet<SystemPreference> SystemPreferences { get; set; }
        public System.Data.Entity.DbSet<TableHeader> TableHeaders { get; set; }
        public System.Data.Entity.DbSet<TablePreference> TablePreferences { get; set; }
        public System.Data.Entity.DbSet<Task> Tasks { get; set; }
        public System.Data.Entity.DbSet<TaskContact> TaskContacts { get; set; }
        public System.Data.Entity.DbSet<TaskShare> TaskShares { get; set; }
        public System.Data.Entity.DbSet<TaskType> TaskTypes { get; set; }
        public System.Data.Entity.DbSet<TempNotification> TempNotifications { get; set; }
        public System.Data.Entity.DbSet<TempNotificationField> TempNotificationFields { get; set; }
        public System.Data.Entity.DbSet<Triggers_ConvertAction> Triggers_ConvertActions { get; set; }
        public System.Data.Entity.DbSet<Triggers_CustomFieldOptionMapping> Triggers_CustomFieldOptionMappings { get; set; }
        public System.Data.Entity.DbSet<Triggers_CustomObjectConversionField> Triggers_CustomObjectConversionFields { get; set; }
        public System.Data.Entity.DbSet<Triggers_CustomObjectModifyField> Triggers_CustomObjectModifyFields { get; set; }
        public System.Data.Entity.DbSet<Triggers_CustomObjectRowTrigger> Triggers_CustomObjectRowTriggers { get; set; }
        public System.Data.Entity.DbSet<Triggers_CustomObjectTrigger> Triggers_CustomObjectTriggers { get; set; }
        public System.Data.Entity.DbSet<Triggers_CustomObjectTriggerAction> Triggers_CustomObjectTriggerActions { get; set; }
        public System.Data.Entity.DbSet<Triggers_CustomObjectTriggerPropertyValue> Triggers_CustomObjectTriggerPropertyValues { get; set; }
        public System.Data.Entity.DbSet<Triggers_ModifyAction> Triggers_ModifyActions { get; set; }
        public System.Data.Entity.DbSet<Triggers_NotifyAction> Triggers_NotifyActions { get; set; }
        public System.Data.Entity.DbSet<Triggers_UserTriggerActionNotification> Triggers_UserTriggerActionNotifications { get; set; }
        public System.Data.Entity.DbSet<UsageAction> UsageActions { get; set; }
        public System.Data.Entity.DbSet<UsageLevel> UsageLevels { get; set; }
        public System.Data.Entity.DbSet<UsageRecord> UsageRecords { get; set; }
        public System.Data.Entity.DbSet<User> Users { get; set; }
        public System.Data.Entity.DbSet<UserClaim> UserClaims { get; set; }
        public System.Data.Entity.DbSet<UserEmailNotificationPreference> UserEmailNotificationPreferences { get; set; }
        public System.Data.Entity.DbSet<UserLogin> UserLogins { get; set; }
        public System.Data.Entity.DbSet<UserProfile> UserProfiles { get; set; }
        public System.Data.Entity.DbSet<UserRole> UserRoles { get; set; }
        public System.Data.Entity.DbSet<UserTarget> UserTargets { get; set; }
        public System.Data.Entity.DbSet<ViewRecord> ViewRecords { get; set; }
        public System.Data.Entity.DbSet<WatchNotificationEmail> WatchNotificationEmails { get; set; }

        public FakeVelocityRocketLegacyContext1()
        {
            Accounts = new FakeDbSet<Account>("Id");
            AccountShares = new FakeDbSet<AccountShare>("Id");
            AcheivedAwards = new FakeDbSet<AcheivedAward>("Id");
            AddOns = new FakeDbSet<AddOn>("Id");
            AddOnClaims = new FakeDbSet<AddOnClaim>("Id");
            AddOnClaimValues = new FakeDbSet<AddOnClaimValue>("SubscriptionAddOnId", "AddOnClaimId");
            AddOnCosts = new FakeDbSet<AddOnCost>("Id");
            ApiAuthentications = new FakeDbSet<ApiAuthentication>("Id");
            ApiConnectors = new FakeDbSet<ApiConnector>("Id");
            ApiKeys = new FakeDbSet<ApiKey>("Id");
            ApiTypeImportQueueItems = new FakeDbSet<ApiTypeImportQueueItem>("Id");
            Attachments = new FakeDbSet<Attachment>("Id");
            AvailableSlots = new FakeDbSet<AvailableSlot>("Id");
            Awards = new FakeDbSet<Award>("Id");
            BuyingProcesses = new FakeDbSet<BuyingProcess>("Id");
            BuyingProcessStages = new FakeDbSet<BuyingProcessStage>("Id");
            Coaching_AdminConnectorLogs = new FakeDbSet<Coaching_AdminConnectorLog>("ConnectorLogId");
            Coaching_AdminEventLogs = new FakeDbSet<Coaching_AdminEventLog>("EventLogId", "Description", "EventTypeId");
            Coaching_Assets = new FakeDbSet<Coaching_Asset>("AssetId");
            Coaching_AssetTags = new FakeDbSet<Coaching_AssetTag>("AssetTagId");
            Coaching_AssetTypes = new FakeDbSet<Coaching_AssetType>("AssetTypeId");
            Coaching_Broadcasters = new FakeDbSet<Coaching_Broadcaster>("BroadcasterId");
            Coaching_Channels = new FakeDbSet<Coaching_Channel>("ChannelId");
            Coaching_CoachingUsers = new FakeDbSet<Coaching_CoachingUser>("CoachingUserId");
            Coaching_Programs = new FakeDbSet<Coaching_Program>("ProgramId");
            Coaching_ProgramAssets = new FakeDbSet<Coaching_ProgramAsset>("ProgramAssetId");
            Coaching_StaThemes = new FakeDbSet<Coaching_StaTheme>("StaThemeId", "StaId", "ThemeId", "IsActive");
            Coaching_Tags = new FakeDbSet<Coaching_Tag>("TagId");
            Coaching_Themes = new FakeDbSet<Coaching_Theme>("Id", "EmailConfiguration", "UniqueName");
            Coaching_UserFavorites = new FakeDbSet<Coaching_UserFavorite>("UserFavoriteId");
            Coaching_UserFolders = new FakeDbSet<Coaching_UserFolder>("UserFolderId");
            Coaching_UserRatings = new FakeDbSet<Coaching_UserRating>("UserRatingId");
            Coaching_UserShares = new FakeDbSet<Coaching_UserShare>("UserShareId");
            Coaching_UserViews = new FakeDbSet<Coaching_UserView>("UserViewId");
            ColumnPreferences = new FakeDbSet<ColumnPreference>("Id");
            Comments = new FakeDbSet<Comment>("Id");
            Contacts = new FakeDbSet<Contact>("Id");
            ContactShares = new FakeDbSet<ContactShare>("Id");
            CountryLists = new FakeDbSet<CountryList>("Id");
            Currencies = new FakeDbSet<Currency>("Id");
            CurrencyAmounts = new FakeDbSet<CurrencyAmount>("Id");
            CustomFields = new FakeDbSet<CustomField>("Id");
            CustomFieldGroups = new FakeDbSet<CustomFieldGroup>("Id");
            CustomFieldOptions = new FakeDbSet<CustomFieldOption>("Id");
            CustomFieldTypeGroups = new FakeDbSet<CustomFieldTypeGroup>("Id");
            CustomFieldValidations = new FakeDbSet<CustomFieldValidation>("Id");
            CustomFieldValues = new FakeDbSet<CustomFieldValue>("CustomFieldId", "EntityId");
            CustomLinksAndButtons = new FakeDbSet<CustomLinksAndButton>("Id");
            CustomLinksAndButtonsForRoles = new FakeDbSet<CustomLinksAndButtonsForRole>("Id");
            CustomLinksApiTypes = new FakeDbSet<CustomLinksApiType>("Id");
            CustomLinksButtonPlacements = new FakeDbSet<CustomLinksButtonPlacement>("Id");
            CustomLinksUrls = new FakeDbSet<CustomLinksUrl>("Id");
            CustomObjects = new FakeDbSet<CustomObject>("Id");
            CustomObjectFilters = new FakeDbSet<CustomObjectFilter>("Id");
            CustomObjectFilterFields = new FakeDbSet<CustomObjectFilterField>("Id");
            CustomObjectRows = new FakeDbSet<CustomObjectRow>("Id");
            CustomObjectRowFields = new FakeDbSet<CustomObjectRowField>("Id");
            Deals = new FakeDbSet<Deal>("Id");
            DealContacts = new FakeDbSet<DealContact>("Id");
            DealContactRoles = new FakeDbSet<DealContactRole>("Id");
            DealOrgCharts = new FakeDbSet<DealOrgChart>("Id");
            DealShares = new FakeDbSet<DealShare>("Id");
            DealStageHistories = new FakeDbSet<DealStageHistory>("Id");
            DealSteps = new FakeDbSet<DealStep>("DealId", "StepId");
            DefaultAddOnInEdition1 = new FakeDbSet<DefaultAddOnInEdition1>("AddOnId", "EditionId");
            Editions = new FakeDbSet<Edition>("Id");
            EditionCosts = new FakeDbSet<EditionCost>("EditionCostId");
            EmailConfigurations = new FakeDbSet<EmailConfiguration>("Id");
            EmailNotifications = new FakeDbSet<EmailNotification>("UserId", "EmailType");
            EmailTemplates = new FakeDbSet<EmailTemplate>("Id");
            EmailTemplateConfigurations = new FakeDbSet<EmailTemplateConfiguration>("TemplateId");
            ExchangeRates = new FakeDbSet<ExchangeRate>("Id");
            ExternalIntegrations = new FakeDbSet<ExternalIntegration>("Id");
            ExternalIntegrationFieldMappings = new FakeDbSet<ExternalIntegrationFieldMapping>("Id");
            ExternalIntegrationTypeMappings = new FakeDbSet<ExternalIntegrationTypeMapping>("Id");
            Features = new FakeDbSet<Feature>("Id");
            FeatureClaims = new FakeDbSet<FeatureClaim>("Id");
            Groups = new FakeDbSet<Group>("Id");
            IdenServ_Clients = new FakeDbSet<IdenServ_Client>("Id");
            IdenServ_ClientClaims = new FakeDbSet<IdenServ_ClientClaim>("Id");
            IdenServ_ClientCorsOrigins = new FakeDbSet<IdenServ_ClientCorsOrigin>("Id");
            IdenServ_ClientCustomGrantTypes = new FakeDbSet<IdenServ_ClientCustomGrantType>("Id");
            IdenServ_ClientIdPRestrictions = new FakeDbSet<IdenServ_ClientIdPRestriction>("Id");
            IdenServ_ClientPostLogoutRedirectUris = new FakeDbSet<IdenServ_ClientPostLogoutRedirectUri>("Id");
            IdenServ_ClientRedirectUris = new FakeDbSet<IdenServ_ClientRedirectUri>("Id");
            IdenServ_ClientScopes = new FakeDbSet<IdenServ_ClientScope>("Id");
            IdenServ_ClientSecrets = new FakeDbSet<IdenServ_ClientSecret>("Id");
            IdenServ_Consents = new FakeDbSet<IdenServ_Consent>("Subject", "ClientId");
            IdenServ_Scopes = new FakeDbSet<IdenServ_Scope>("Id");
            IdenServ_ScopeClaims = new FakeDbSet<IdenServ_ScopeClaim>("Id");
            IdenServ_ScopeSecrets = new FakeDbSet<IdenServ_ScopeSecret>("Id");
            IdenServ_Tokens = new FakeDbSet<IdenServ_Token>("Key", "TokenType");
            ImportedDatas = new FakeDbSet<ImportedData>("Id");
            IntegrationPackages = new FakeDbSet<IntegrationPackage>("Id");
            Invites = new FakeDbSet<Invite>("Id");
            ItemSteps = new FakeDbSet<ItemStep>("Id");
            LeadConversions = new FakeDbSet<LeadConversion>("Id");
            LeadStatus = new FakeDbSet<LeadStatu>("Id");
            Localizations = new FakeDbSet<Localization>("Pk");
            LogoImages = new FakeDbSet<LogoImage>("Id");
            MaintenanceSchedules = new FakeDbSet<MaintenanceSchedule>("Id");
            MeetingVisualiserChartItems = new FakeDbSet<MeetingVisualiserChartItem>("Id");
            Notifications = new FakeDbSet<Notification>("Id");
            NotificationFields = new FakeDbSet<NotificationField>("Id");
            OAuth2Token = new FakeDbSet<OAuth2Token>("Id");
            Organisations = new FakeDbSet<Organisation>("Id");
            OrganisationAllowedRoles = new FakeDbSet<OrganisationAllowedRole>("Id");
            OrganisationSalesObjectViews = new FakeDbSet<OrganisationSalesObjectView>("Id");
            OrgEmailNotificiationPreferences = new FakeDbSet<OrgEmailNotificiationPreference>("EmailTemplateConfigurationId", "OrgId");
            PackageItems = new FakeDbSet<PackageItem>("Id");
            PasswordResetRequests = new FakeDbSet<PasswordResetRequest>("Id");
            PickLists = new FakeDbSet<PickList>("Id");
            PickListOptions = new FakeDbSet<PickListOption>("Id");
            ReminderTasks = new FakeDbSet<ReminderTask>("Id");
            Roles = new FakeDbSet<Role>("Id");
            RoleClaims = new FakeDbSet<RoleClaim>("Id");
            Rules = new FakeDbSet<Rule>("Id");
            SalesObjectViews = new FakeDbSet<SalesObjectView>("Id");
            SalesObjectViewArchives = new FakeDbSet<SalesObjectViewArchive>("Id");
            SalesObjectViewArchiveItems = new FakeDbSet<SalesObjectViewArchiveItem>("Id");
            SalesProcesses = new FakeDbSet<SalesProcess>("Id");
            SalesTrainingCompanies = new FakeDbSet<SalesTrainingCompany>("Id");
            Searches = new FakeDbSet<Search>("Id");
            Sections = new FakeDbSet<Section>("Id");
            SectionCustomLinks = new FakeDbSet<SectionCustomLink>("Id");
            SideNavs = new FakeDbSet<SideNav>("Id");
            SideNavItems = new FakeDbSet<SideNavItem>("Id");
            SideNavSideNavItemLookups = new FakeDbSet<SideNavSideNavItemLookup>("SideNavId", "SideNavItemId");
            Stages = new FakeDbSet<Stage>("Id");
            StandardObjectDefinitions = new FakeDbSet<StandardObjectDefinition>("Id");
            StandardObjectRelationshipDefintions = new FakeDbSet<StandardObjectRelationshipDefintion>("Id");
            StandardRelationships = new FakeDbSet<StandardRelationship>("Id");
            Statements = new FakeDbSet<Statement>("Id");
            StcOrgs = new FakeDbSet<StcOrg>("SalesTrainingCompanyId", "OrganisationId");
            StcThemes = new FakeDbSet<StcTheme>("Id");
            Steps = new FakeDbSet<Step>("Id");
            StepActionFiles = new FakeDbSet<StepActionFile>("Id");
            StepDocuments = new FakeDbSet<StepDocument>("Id");
            Subscriptions = new FakeDbSet<Subscription>("Id");
            SubscriptionAddOns = new FakeDbSet<SubscriptionAddOn>("Id");
            SystemPreferences = new FakeDbSet<SystemPreference>("Id");
            TableHeaders = new FakeDbSet<TableHeader>("Id");
            TablePreferences = new FakeDbSet<TablePreference>("Id");
            Tasks = new FakeDbSet<Task>("Id");
            TaskContacts = new FakeDbSet<TaskContact>("TaskId", "ContactId");
            TaskShares = new FakeDbSet<TaskShare>("Id");
            TaskTypes = new FakeDbSet<TaskType>("Id");
            TempNotifications = new FakeDbSet<TempNotification>("Id", "TableIdValue");
            TempNotificationFields = new FakeDbSet<TempNotificationField>("Id");
            Triggers_ConvertActions = new FakeDbSet<Triggers_ConvertAction>("Id");
            Triggers_CustomFieldOptionMappings = new FakeDbSet<Triggers_CustomFieldOptionMapping>("Id");
            Triggers_CustomObjectConversionFields = new FakeDbSet<Triggers_CustomObjectConversionField>("Id");
            Triggers_CustomObjectModifyFields = new FakeDbSet<Triggers_CustomObjectModifyField>("Id");
            Triggers_CustomObjectRowTriggers = new FakeDbSet<Triggers_CustomObjectRowTrigger>("Id");
            Triggers_CustomObjectTriggers = new FakeDbSet<Triggers_CustomObjectTrigger>("Id");
            Triggers_CustomObjectTriggerActions = new FakeDbSet<Triggers_CustomObjectTriggerAction>("Id");
            Triggers_CustomObjectTriggerPropertyValues = new FakeDbSet<Triggers_CustomObjectTriggerPropertyValue>("Id");
            Triggers_ModifyActions = new FakeDbSet<Triggers_ModifyAction>("Id");
            Triggers_NotifyActions = new FakeDbSet<Triggers_NotifyAction>("Id");
            Triggers_UserTriggerActionNotifications = new FakeDbSet<Triggers_UserTriggerActionNotification>("Id");
            UsageActions = new FakeDbSet<UsageAction>("Id");
            UsageLevels = new FakeDbSet<UsageLevel>("Id");
            UsageRecords = new FakeDbSet<UsageRecord>("Id");
            Users = new FakeDbSet<User>("UserId");
            UserClaims = new FakeDbSet<UserClaim>("Id");
            UserEmailNotificationPreferences = new FakeDbSet<UserEmailNotificationPreference>("EmailTemplateConfigurationId", "UserId");
            UserLogins = new FakeDbSet<UserLogin>("LoginProvider", "ProviderKey", "UserId");
            UserProfiles = new FakeDbSet<UserProfile>("Id");
            UserRoles = new FakeDbSet<UserRole>("UserId", "RoleId");
            UserTargets = new FakeDbSet<UserTarget>("UserTargetId");
            ViewRecords = new FakeDbSet<ViewRecord>("Id");
            WatchNotificationEmails = new FakeDbSet<WatchNotificationEmail>("Id");

            InitializePartial();
        }

        public int SaveChangesCount { get; private set; }
        public int SaveChanges()
        {
            ++SaveChangesCount;
            return 1;
        }

        public System.Threading.Tasks.Task<int> SaveChangesAsync()
        {
            ++SaveChangesCount;
            return System.Threading.Tasks.Task<int>.Factory.StartNew(() => 1);
        }

        public System.Threading.Tasks.Task<int> SaveChangesAsync(System.Threading.CancellationToken cancellationToken)
        {
            ++SaveChangesCount;
            return System.Threading.Tasks.Task<int>.Factory.StartNew(() => 1, cancellationToken);
        }

        partial void InitializePartial();

        protected virtual void Dispose(bool disposing)
        {
        }

        public void Dispose()
        {
            Dispose(true);
        }

        public System.Data.Entity.Infrastructure.DbChangeTracker ChangeTracker { get; }
        public System.Data.Entity.Infrastructure.DbContextConfiguration Configuration { get; }
        public System.Data.Entity.Database Database { get; }
        public System.Data.Entity.Infrastructure.DbEntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class
        {
            throw new System.NotImplementedException();
        }
        public System.Data.Entity.Infrastructure.DbEntityEntry Entry(object entity)
        {
            throw new System.NotImplementedException();
        }
        public System.Collections.Generic.IEnumerable<System.Data.Entity.Validation.DbEntityValidationResult> GetValidationErrors()
        {
            throw new System.NotImplementedException();
        }
        public System.Data.Entity.DbSet Set(System.Type entityType)
        {
            throw new System.NotImplementedException();
        }
        public System.Data.Entity.DbSet<TEntity> Set<TEntity>() where TEntity : class
        {
            throw new System.NotImplementedException();
        }
        public override string ToString()
        {
            throw new System.NotImplementedException();
        }


        // Stored Procedures
        public int SpCloneSalesProcesses(System.Data.DataTable idList)
        {

            return 0;
        }

    }
}
// </auto-generated>

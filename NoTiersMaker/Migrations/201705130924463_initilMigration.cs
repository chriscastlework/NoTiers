namespace CustomLogic.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initilMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Accounts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        RevenueCurrency = c.String(),
                        RevenueAmount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        AddressLine1 = c.String(),
                        AddressLine2 = c.String(),
                        County = c.String(),
                        PostCode = c.String(),
                        PhoneNumber = c.String(),
                        MainContactIndex = c.String(),
                        OwnerId = c.String(maxLength: 128),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        DateLastModeified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                        LogoImage_Id = c.Int(),
                        City = c.String(),
                        Country = c.String(),
                        AccountType = c.Int(nullable: false),
                        ExternalId = c.String(),
                        SalesProcessId = c.Int(),
                        StageId = c.Int(),
                        Notes = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .ForeignKey("dbo.LogoImages", t => t.LogoImage_Id)
                .ForeignKey("dbo.Users", t => t.OwnerId)
                .ForeignKey("dbo.SalesProcesses", t => t.SalesProcessId)
                .ForeignKey("dbo.Stages", t => t.StageId)
                .Index(t => t.OwnerId)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById)
                .Index(t => t.LogoImage_Id)
                .Index(t => t.SalesProcessId)
                .Index(t => t.StageId);
            
            CreateTable(
                "dbo.StepDocuments",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DealId = c.Int(),
                        StepId = c.Int(nullable: false),
                        OriginalName = c.String(),
                        Name = c.String(),
                        Extension = c.String(),
                        ContentType = c.String(),
                        Size = c.Long(nullable: false),
                        Content = c.Binary(maxLength: 8000),
                        Uploaded = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        CustomTableRowId = c.Long(),
                        LeadId = c.Int(),
                        AccountId = c.Int(),
                        PartnerId = c.Int(),
                        TaskId = c.Int(),
                        CountactId = c.Int(),
                        Contact_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.AccountId)
                .ForeignKey("dbo.Contacts", t => t.Contact_Id)
                .ForeignKey("dbo.CustomObjectRows", t => t.CustomTableRowId)
                .ForeignKey("dbo.Deals", t => t.DealId)
                .ForeignKey("dbo.Deals", t => t.LeadId)
                .ForeignKey("dbo.Accounts", t => t.PartnerId)
                .ForeignKey("dbo.Steps", t => t.StepId, cascadeDelete: true)
                .ForeignKey("dbo.Tasks", t => t.TaskId)
                .Index(t => t.DealId)
                .Index(t => t.StepId)
                .Index(t => t.CustomTableRowId)
                .Index(t => t.LeadId)
                .Index(t => t.AccountId)
                .Index(t => t.PartnerId)
                .Index(t => t.TaskId)
                .Index(t => t.Contact_Id);
            
            CreateTable(
                "dbo.Contacts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FirstName = c.String(),
                        LastName = c.String(),
                        Title = c.String(),
                        Location = c.String(),
                        Email = c.String(),
                        Phone = c.String(),
                        Skype = c.String(),
                        OrganisationId = c.Int(nullable: false),
                        JobTitle = c.String(),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        DateLastModeified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                        AccountId = c.Int(),
                        LogoImage_Id = c.Int(),
                        ExternalId = c.String(),
                        SalesProcessId = c.Int(),
                        StageId = c.Int(),
                        Notes = c.String(),
                        OfficePhone = c.String(),
                        MobilePhone = c.String(),
                        OtherPhone = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.AccountId)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .ForeignKey("dbo.LogoImages", t => t.LogoImage_Id)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId, cascadeDelete: true)
                .ForeignKey("dbo.SalesProcesses", t => t.SalesProcessId)
                .ForeignKey("dbo.Stages", t => t.StageId)
                .Index(t => t.OrganisationId)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById)
                .Index(t => t.AccountId)
                .Index(t => t.LogoImage_Id)
                .Index(t => t.SalesProcessId)
                .Index(t => t.StageId);
            
            CreateTable(
                "dbo.ContactShares",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(),
                        DateShared = c.DateTime(precision: 7, storeType: "datetime2"),
                        Contact_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Contacts", t => t.Contact_Id)
                .Index(t => t.Contact_Id);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        Email = c.String(),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(precision: 7, storeType: "datetime2"),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(),
                        FirstName = c.String(),
                        LastName = c.String(),
                        OrganisationId = c.Int(),
                        UserStatus = c.Int(),
                        UserProfileId = c.Int(),
                        Task_Id = c.Int(),
                        VerificationCode = c.String(),
                        Organisation_Id = c.Int(),
                        SystemPreferences_Id = c.Int(),
                        LogoImage_Id = c.Int(),
                        LoginCount = c.Int(),
                        CreateDateTime = c.DateTime(precision: 7, storeType: "datetime2"),
                        ManagerId = c.String(maxLength: 128),
                        ExternalId = c.String(),
                    })
                .PrimaryKey(t => t.UserId)
                .ForeignKey("dbo.LogoImages", t => t.LogoImage_Id)
                .ForeignKey("dbo.Users", t => t.ManagerId)
                .ForeignKey("dbo.Organisations", t => t.Organisation_Id)
                .ForeignKey("dbo.SystemPreferences", t => t.SystemPreferences_Id)
                .ForeignKey("dbo.Tasks", t => t.Task_Id)
                .ForeignKey("dbo.UserProfiles", t => t.UserProfileId)
                .Index(t => t.UserProfileId)
                .Index(t => t.Task_Id)
                .Index(t => t.Organisation_Id)
                .Index(t => t.SystemPreferences_Id)
                .Index(t => t.LogoImage_Id)
                .Index(t => t.ManagerId);
            
            CreateTable(
                "dbo.AcheivedAwards",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        AwardId = c.Int(nullable: false),
                        AcheviedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        User_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Awards", t => t.AwardId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.User_Id)
                .Index(t => t.AwardId)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.Awards",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Accessor = c.String(),
                        Points = c.Int(nullable: false),
                        IconName = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ApiAuthentications",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ApiAuthenticationToken = c.String(),
                        Expiry = c.DateTime(precision: 7, storeType: "datetime2"),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        DateLastModeified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById);
            
            CreateTable(
                "dbo.ApiKeys",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Key = c.String(),
                        Enabled = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        DateLastModeified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                        ContactFirst = c.String(),
                        ContactLast = c.String(),
                        ContactEmail = c.String(),
                        OrganisationId = c.Int(),
                        Company = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.Organisations",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        BillingCurrency = c.String(),
                        Subscription_Id = c.Int(),
                        BraintreeCustomerId = c.String(),
                        IsGlobalPermissions = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        DateLastModeified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                        AllowMultipleDealContactRoles = c.Boolean(nullable: false),
                        DefaultOrgCurrency = c.String(),
                        FinacialYearEndDateTime = c.DateTime(precision: 7, storeType: "datetime2"),
                        NewTrialNotificationEmailSent = c.Boolean(nullable: false),
                        GlobalEmailPreferences = c.Boolean(nullable: false),
                        DefaultStc_Id = c.Int(),
                        OrganisationTheme_Id = c.Int(),
                        HasOrganisationTheme = c.Boolean(nullable: false),
                        IsStc_Id = c.Int(),
                        DealsLimit = c.Int(),
                        LeadsLimit = c.Int(),
                        ContactsLimit = c.Int(),
                        PartnersLimit = c.Int(),
                        AccountsLimit = c.Int(),
                        TasksLimit = c.Int(),
                        CustomObjectsLimit = c.Int(),
                        EnableImpersonate = c.Boolean(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .ForeignKey("dbo.SalesTrainingCompanies", t => t.IsStc_Id)
                .ForeignKey("dbo.StcThemes", t => t.OrganisationTheme_Id)
                .ForeignKey("dbo.Subscriptions", t => t.Subscription_Id)
                .Index(t => t.Subscription_Id)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById)
                .Index(t => t.OrganisationTheme_Id)
                .Index(t => t.IsStc_Id);
            
            CreateTable(
                "dbo.CustomFieldGroups",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OrganisationId = c.Int(nullable: false),
                        Name = c.String(),
                        GroupType = c.Int(nullable: false),
                        IsEnabled = c.Boolean(nullable: false),
                        DisplayOrder = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId, cascadeDelete: true)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.CustomFields",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        FieldType = c.Int(nullable: false),
                        ValdiationRegex = c.String(),
                        OrganisationId = c.Int(nullable: false),
                        EntityType = c.Int(nullable: false),
                        IconClass = c.String(),
                        Color = c.String(),
                        CustomObjectRow_Id = c.Long(),
                        CustomObject_Id = c.Long(),
                        IsNotVisible = c.Boolean(nullable: false),
                        CustomFieldGroupId = c.Int(),
                        DisplayOrder = c.Int(nullable: false),
                        CustomFieldValidation_Id = c.Int(),
                        Required = c.Boolean(nullable: false),
                        Min = c.Int(),
                        Max = c.Int(),
                        MinDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        MaxDate = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CustomFieldGroups", t => t.CustomFieldGroupId)
                .ForeignKey("dbo.CustomFieldValidations", t => t.CustomFieldValidation_Id)
                .ForeignKey("dbo.CustomObjects", t => t.CustomObject_Id)
                .ForeignKey("dbo.CustomObjectRows", t => t.CustomObjectRow_Id)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId, cascadeDelete: true)
                .Index(t => t.OrganisationId)
                .Index(t => t.CustomObjectRow_Id)
                .Index(t => t.CustomObject_Id)
                .Index(t => t.CustomFieldGroupId)
                .Index(t => t.CustomFieldValidation_Id);
            
            CreateTable(
                "dbo.CustomFieldOptions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CustomFieldId = c.Int(nullable: false),
                        Label = c.String(),
                        Value = c.String(),
                        DisplayOrder = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CustomFields", t => t.CustomFieldId, cascadeDelete: true)
                .Index(t => t.CustomFieldId);
            
            CreateTable(
                "dbo.CustomFieldValidations",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Regex = c.String(),
                        FieldType = c.Int(nullable: false),
                        ErrorMessage = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CustomFieldValues",
                c => new
                    {
                        CustomFieldId = c.Int(nullable: false),
                        EntityId = c.Int(nullable: false),
                        Value = c.String(),
                    })
                .PrimaryKey(t => new { t.CustomFieldId, t.EntityId })
                .ForeignKey("dbo.CustomFields", t => t.CustomFieldId, cascadeDelete: true)
                .Index(t => t.CustomFieldId);
            
            CreateTable(
                "dbo.CustomObjects",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(),
                        Created = c.DateTime(precision: 7, storeType: "datetime2"),
                        LastModified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedBy_Id = c.String(maxLength: 128),
                        LastModifiedBy_Id = c.String(maxLength: 128),
                        Organisation_Id = c.Int(),
                        Key = c.String(),
                        NumericLimit = c.Int(),
                        VrReadOnly = c.Boolean(nullable: false),
                        AdminOnly = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.CreatedBy_Id)
                .ForeignKey("dbo.Users", t => t.LastModifiedBy_Id)
                .ForeignKey("dbo.Organisations", t => t.Organisation_Id)
                .Index(t => t.CreatedBy_Id)
                .Index(t => t.LastModifiedBy_Id)
                .Index(t => t.Organisation_Id);
            
            CreateTable(
                "dbo.CustomObjectFilters",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        CustomObjectId = c.Long(nullable: false),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                        Created = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        LastModified = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.CustomObjects", t => t.CustomObjectId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .Index(t => t.CustomObjectId)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById);
            
            CreateTable(
                "dbo.CustomObjectFilterFields",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CustomObjectFilterId = c.Int(nullable: false),
                        CustomFieldId = c.Int(nullable: false),
                        PrefixText = c.String(),
                        SuffixText = c.String(),
                        Order = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CustomFields", t => t.CustomFieldId, cascadeDelete: true)
                .ForeignKey("dbo.CustomObjectFilters", t => t.CustomObjectFilterId, cascadeDelete: true)
                .Index(t => t.CustomObjectFilterId)
                .Index(t => t.CustomFieldId);
            
            CreateTable(
                "dbo.CustomObjectRows",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Name = c.String(),
                        Created = c.DateTime(precision: 7, storeType: "datetime2"),
                        LastModified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedBy_Id = c.String(maxLength: 128),
                        LastModifiedBy_Id = c.String(maxLength: 128),
                        Organisation_Id = c.Int(),
                        CustomObject_Id = c.Long(),
                        OwnerId = c.String(maxLength: 128),
                        SalesProcessId = c.Int(),
                        StageId = c.Int(),
                        ExternalId = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.CreatedBy_Id)
                .ForeignKey("dbo.CustomObjects", t => t.CustomObject_Id)
                .ForeignKey("dbo.Users", t => t.LastModifiedBy_Id)
                .ForeignKey("dbo.Organisations", t => t.Organisation_Id)
                .ForeignKey("dbo.Users", t => t.OwnerId)
                .ForeignKey("dbo.SalesProcesses", t => t.SalesProcessId)
                .ForeignKey("dbo.Stages", t => t.StageId)
                .Index(t => t.CreatedBy_Id)
                .Index(t => t.LastModifiedBy_Id)
                .Index(t => t.Organisation_Id)
                .Index(t => t.CustomObject_Id)
                .Index(t => t.OwnerId)
                .Index(t => t.SalesProcessId)
                .Index(t => t.StageId);
            
            CreateTable(
                "dbo.CustomObjectRowFields",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Value = c.String(),
                        Field_Id = c.Int(),
                        CustomObjectRow_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CustomFields", t => t.Field_Id)
                .ForeignKey("dbo.CustomObjectRows", t => t.CustomObjectRow_Id)
                .Index(t => t.Field_Id)
                .Index(t => t.CustomObjectRow_Id);
            
            CreateTable(
                "dbo.ItemSteps",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ActionValue = c.String(),
                        ActionIdValue = c.Int(),
                        Completed = c.Boolean(nullable: false),
                        CompletedDateTime = c.DateTime(precision: 7, storeType: "datetime2"),
                        Hidden = c.Boolean(nullable: false),
                        StepId = c.Int(),
                        ReminderTaskId = c.Int(),
                        CustomObjectRowId = c.Long(),
                        TaskId = c.Int(),
                        ContactId = c.Int(),
                        AccountId = c.Int(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.AccountId)
                .ForeignKey("dbo.Contacts", t => t.ContactId)
                .ForeignKey("dbo.CustomObjectRows", t => t.CustomObjectRowId)
                .ForeignKey("dbo.ReminderTasks", t => t.ReminderTaskId)
                .ForeignKey("dbo.Steps", t => t.StepId)
                .ForeignKey("dbo.Tasks", t => t.TaskId)
                .Index(t => t.StepId)
                .Index(t => t.ReminderTaskId)
                .Index(t => t.CustomObjectRowId)
                .Index(t => t.TaskId)
                .Index(t => t.ContactId)
                .Index(t => t.AccountId);
            
            CreateTable(
                "dbo.ReminderTasks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TaskId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Tasks", t => t.TaskId, cascadeDelete: true)
                .Index(t => t.TaskId);
            
            CreateTable(
                "dbo.DealSteps",
                c => new
                    {
                        DealId = c.Int(nullable: false),
                        StepId = c.Int(nullable: false),
                        ActionValue = c.String(),
                        ActionIdValue = c.Int(),
                        CompletedDateTime = c.DateTime(precision: 7, storeType: "datetime2"),
                        Hidden = c.Boolean(nullable: false),
                        Completed = c.Boolean(nullable: false),
                        ReminderTaskId = c.Int(),
                    })
                .PrimaryKey(t => new { t.DealId, t.StepId })
                .ForeignKey("dbo.Deals", t => t.DealId, cascadeDelete: true)
                .ForeignKey("dbo.ReminderTasks", t => t.ReminderTaskId)
                .ForeignKey("dbo.Steps", t => t.StepId, cascadeDelete: true)
                .Index(t => t.DealId)
                .Index(t => t.StepId)
                .Index(t => t.ReminderTaskId);
            
            CreateTable(
                "dbo.Deals",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        OwnerId = c.String(maxLength: 128),
                        StartDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        ExpectedCloseDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        RevenueCurrency = c.String(maxLength: 128),
                        RevenueAmount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        StageId = c.Int(),
                        MainDealContactId = c.Int(),
                        AccountId = c.Int(),
                        SalesProcessId = c.Int(),
                        CloseDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        CloseReason = c.String(),
                        CloseStatus = c.Int(),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        DateLastModeified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                        StageLastUpdated = c.DateTime(precision: 7, storeType: "datetime2"),
                        Overview = c.String(),
                        TrashDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        TrashedUserId = c.String(maxLength: 128),
                        DealType = c.Int(nullable: false),
                        LeadRating = c.Int(),
                        LeadFollowUpDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        LeadConversionApproverId = c.String(maxLength: 128),
                        LeadContactId = c.Int(),
                        LeadPotentialRevenue = c.Decimal(precision: 18, scale: 2),
                        LeadStatusId = c.Int(),
                        ExternalId = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.AccountId)
                .ForeignKey("dbo.Contacts", t => t.LeadContactId)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.Currencies", t => t.RevenueCurrency)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .ForeignKey("dbo.Users", t => t.LeadConversionApproverId)
                .ForeignKey("dbo.LeadStatus", t => t.LeadStatusId)
                .ForeignKey("dbo.Users", t => t.OwnerId)
                .ForeignKey("dbo.SalesProcesses", t => t.SalesProcessId)
                .ForeignKey("dbo.Stages", t => t.StageId)
                .ForeignKey("dbo.Users", t => t.TrashedUserId)
                .Index(t => t.OwnerId)
                .Index(t => t.RevenueCurrency)
                .Index(t => t.StageId)
                .Index(t => t.AccountId)
                .Index(t => t.SalesProcessId)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById)
                .Index(t => t.TrashedUserId)
                .Index(t => t.LeadConversionApproverId)
                .Index(t => t.LeadContactId)
                .Index(t => t.LeadStatusId);
            
            CreateTable(
                "dbo.Attachments",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        OwnerId = c.String(),
                        Size = c.Long(nullable: false),
                        Type = c.String(),
                        Content = c.Binary(maxLength: 8000),
                        Deal_Id = c.Int(),
                        Uploaded = c.DateTime(precision: 7, storeType: "datetime2"),
                        GuidPath = c.String(),
                        Extension = c.String(),
                        Account_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.Account_Id)
                .ForeignKey("dbo.Deals", t => t.Deal_Id)
                .Index(t => t.Deal_Id)
                .Index(t => t.Account_Id);
            
            CreateTable(
                "dbo.Comments",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DealId = c.Int(),
                        Content = c.String(),
                        DateCreated = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        DateLastModeified = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                        AccountId = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.AccountId)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.Deals", t => t.DealId)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .Index(t => t.DealId)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById)
                .Index(t => t.AccountId);
            
            CreateTable(
                "dbo.Currencies",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        CurrencySymbol = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.DealShares",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(),
                        DateShared = c.DateTime(precision: 7, storeType: "datetime2"),
                        Deal_Id = c.Int(),
                        Writable = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Deals", t => t.Deal_Id)
                .Index(t => t.Deal_Id);
            
            CreateTable(
                "dbo.DealStageHistories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DealId = c.Int(nullable: false),
                        OldStageId = c.Int(),
                        NewStageId = c.Int(nullable: false),
                        UserId = c.String(maxLength: 128),
                        Date = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Deals", t => t.DealId, cascadeDelete: true)
                .ForeignKey("dbo.Stages", t => t.NewStageId, cascadeDelete: true)
                .ForeignKey("dbo.Stages", t => t.OldStageId)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.DealId)
                .Index(t => t.OldStageId)
                .Index(t => t.NewStageId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Stages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        SalesProcessId = c.Int(nullable: false),
                        OrderInProcess = c.Int(nullable: false),
                        StagePercent = c.Int(nullable: false),
                        Description = c.String(),
                        ExternalId = c.String(),
                        Won = c.Boolean(nullable: false),
                        Closed = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SalesProcesses", t => t.SalesProcessId, cascadeDelete: true)
                .Index(t => t.SalesProcessId);
            
            CreateTable(
                "dbo.SalesProcesses",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                        OrganisationId = c.Int(),
                        SalesProcessStatus = c.Int(nullable: false),
                        StepLevelProbability = c.Boolean(nullable: false),
                        CustomTableId = c.Int(),
                        EntityType = c.Int(nullable: false),
                        RecordTypeId = c.String(),
                        AutomaticMandatoryStepProgression = c.Boolean(nullable: false),
                        HideProbability = c.Boolean(),
                        HideVerifiableOutcomes = c.Boolean(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.BuyingProcesses",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SalesProcesses", t => t.Id)
                .Index(t => t.Id);
            
            CreateTable(
                "dbo.BuyingProcessStages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        SalesStagesCount = c.Int(nullable: false),
                        Order = c.Int(nullable: false),
                        BuyingProcess_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.BuyingProcesses", t => t.BuyingProcess_Id)
                .Index(t => t.BuyingProcess_Id);
            
            CreateTable(
                "dbo.Tasks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        DealId = c.Int(),
                        DueDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        IsImportant = c.Boolean(nullable: false),
                        TaskTypeId = c.Int(nullable: false),
                        IsDone = c.Boolean(nullable: false),
                        UserId = c.String(),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        DateLastModeified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                        ChartX = c.Int(nullable: false),
                        ChartY = c.Int(nullable: false),
                        ChartZoom = c.Double(nullable: false),
                        MeetingName = c.String(),
                        MeetingDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        MeetingLocation = c.String(),
                        CompletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        AccountId = c.Int(),
                        Notes = c.String(),
                        ExternalId = c.String(),
                        PendingExternalContacts = c.String(),
                        SalesProcessId = c.Int(),
                        StageId = c.Int(),
                        CustomTableRowId = c.Long(),
                        CustomObjectRow_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.AccountId)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.CustomObjectRows", t => t.CustomObjectRow_Id)
                .ForeignKey("dbo.Deals", t => t.DealId)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .ForeignKey("dbo.SalesProcesses", t => t.SalesProcessId)
                .ForeignKey("dbo.Stages", t => t.StageId)
                .ForeignKey("dbo.TaskTypes", t => t.TaskTypeId, cascadeDelete: true)
                .Index(t => t.DealId)
                .Index(t => t.TaskTypeId)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById)
                .Index(t => t.AccountId)
                .Index(t => t.SalesProcessId)
                .Index(t => t.StageId)
                .Index(t => t.CustomObjectRow_Id);
            
            CreateTable(
                "dbo.StandardObjectRelationshipDefintions",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Relationship = c.Int(nullable: false),
                        CustomObject_Id = c.Long(),
                        StandardObjectType = c.String(),
                        StandardObjectId = c.String(),
                        OnDelete = c.Int(nullable: false),
                        Organisation_Id = c.Int(),
                        Contact_Id = c.Int(),
                        Deal_Id = c.Int(),
                        Task_Id = c.Int(),
                        Account_Id = c.Int(),
                        Name = c.String(),
                        Key = c.String(),
                        DependencySideLabel = c.String(),
                        PrincipleSideLabel = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.Account_Id)
                .ForeignKey("dbo.Contacts", t => t.Contact_Id)
                .ForeignKey("dbo.CustomObjects", t => t.CustomObject_Id)
                .ForeignKey("dbo.Deals", t => t.Deal_Id)
                .ForeignKey("dbo.Organisations", t => t.Organisation_Id)
                .ForeignKey("dbo.Tasks", t => t.Task_Id)
                .Index(t => t.CustomObject_Id)
                .Index(t => t.Organisation_Id)
                .Index(t => t.Contact_Id)
                .Index(t => t.Deal_Id)
                .Index(t => t.Task_Id)
                .Index(t => t.Account_Id);
            
            CreateTable(
                "dbo.StandardRelationships",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        StandardObjectDefinition_Id = c.Long(),
                        Organisation_Id = c.Int(),
                        Contact_Id = c.Int(),
                        Value = c.String(),
                        CustomObjectRow_Id = c.Long(),
                        StandardObjectRelationshipDefintion_Id = c.Long(),
                        ClassName = c.String(),
                        Deal_Id = c.Int(),
                        Task_Id = c.Int(),
                        Account_Id = c.Int(),
                        Key = c.String(),
                        DependantValue = c.String(),
                        CustomObject_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.Account_Id)
                .ForeignKey("dbo.Contacts", t => t.Contact_Id)
                .ForeignKey("dbo.CustomObjects", t => t.CustomObject_Id)
                .ForeignKey("dbo.CustomObjectRows", t => t.CustomObjectRow_Id)
                .ForeignKey("dbo.Deals", t => t.Deal_Id)
                .ForeignKey("dbo.Organisations", t => t.Organisation_Id)
                .ForeignKey("dbo.StandardObjectDefinitions", t => t.StandardObjectDefinition_Id)
                .ForeignKey("dbo.StandardObjectRelationshipDefintions", t => t.StandardObjectRelationshipDefintion_Id)
                .ForeignKey("dbo.Tasks", t => t.Task_Id)
                .Index(t => t.StandardObjectDefinition_Id)
                .Index(t => t.Organisation_Id)
                .Index(t => t.Contact_Id)
                .Index(t => t.CustomObjectRow_Id)
                .Index(t => t.StandardObjectRelationshipDefintion_Id)
                .Index(t => t.Deal_Id)
                .Index(t => t.Task_Id)
                .Index(t => t.Account_Id)
                .Index(t => t.CustomObject_Id);
            
            CreateTable(
                "dbo.StandardObjectDefinitions",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        ClassName = c.String(),
                        QuickAddUrl = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.TableHeaders",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Display = c.String(),
                        Visible = c.Boolean(nullable: false),
                        StandardObjectDefinition_Id = c.Long(),
                        FieldType = c.Int(nullable: false),
                        TestMigration = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.StandardObjectDefinitions", t => t.StandardObjectDefinition_Id)
                .Index(t => t.StandardObjectDefinition_Id);
            
            CreateTable(
                "dbo.UsageRecords",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(maxLength: 128),
                        UsageActionId = c.Int(),
                        StandardObjectDefinitionId = c.Long(),
                        RecordId = c.Int(),
                        DateOfAction = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.StandardObjectDefinitions", t => t.StandardObjectDefinitionId)
                .ForeignKey("dbo.UsageActions", t => t.UsageActionId)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.UsageActionId)
                .Index(t => t.StandardObjectDefinitionId);
            
            CreateTable(
                "dbo.UsageActions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.TaskContacts",
                c => new
                    {
                        TaskId = c.Int(nullable: false),
                        ContactId = c.Int(nullable: false),
                        PictureURL = c.String(),
                        Participation = c.String(),
                        Support = c.String(),
                        X = c.Int(nullable: false),
                        Y = c.Int(nullable: false),
                        Width = c.Int(nullable: false),
                        Height = c.Int(nullable: false),
                        Id = c.Int(nullable: false, identity: true),
                    })
                .PrimaryKey(t => new { t.TaskId, t.ContactId })
                .ForeignKey("dbo.Contacts", t => t.ContactId, cascadeDelete: true)
                .ForeignKey("dbo.Tasks", t => t.TaskId, cascadeDelete: true)
                .Index(t => t.TaskId)
                .Index(t => t.ContactId);
            
            CreateTable(
                "dbo.TaskShares",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(),
                        DateShared = c.DateTime(precision: 7, storeType: "datetime2"),
                        Task_Id = c.Int(),
                        Writable = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Tasks", t => t.Task_Id)
                .Index(t => t.Task_Id);
            
            CreateTable(
                "dbo.TaskTypes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        OrganisationId = c.Int(),
                        IconName = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.ViewRecords",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        DateViewed = c.DateTime(precision: 7, storeType: "datetime2"),
                        AccountId = c.Int(),
                        ContactId = c.Int(),
                        DealId = c.Int(),
                        TaskId = c.Int(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.AccountId)
                .ForeignKey("dbo.Contacts", t => t.ContactId)
                .ForeignKey("dbo.Deals", t => t.DealId)
                .ForeignKey("dbo.Tasks", t => t.TaskId)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.AccountId)
                .Index(t => t.ContactId)
                .Index(t => t.DealId)
                .Index(t => t.TaskId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Sections",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                        StageId = c.Int(nullable: false),
                        OrderInStage = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Stages", t => t.StageId, cascadeDelete: true)
                .Index(t => t.StageId);
            
            CreateTable(
                "dbo.SectionCustomLinks",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SectionId = c.Int(nullable: false),
                        CustomLinkId = c.Int(nullable: false),
                        OrderInSection = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CustomLinksAndButtons", t => t.CustomLinkId, cascadeDelete: true)
                .ForeignKey("dbo.Sections", t => t.SectionId, cascadeDelete: true)
                .Index(t => t.SectionId)
                .Index(t => t.CustomLinkId);
            
            CreateTable(
                "dbo.CustomLinksAndButtons",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Label = c.String(),
                        Url = c.String(),
                        IconType = c.Int(nullable: false),
                        IconClass = c.String(),
                        IconImage = c.Binary(maxLength: 8000),
                        IsActive = c.Boolean(nullable: false),
                        CustomLinksButtonPlacement_Id = c.Int(),
                        CustomLinksUrl_Id = c.Int(),
                        OrganisationId = c.Int(nullable: false),
                        Action = c.Int(nullable: false),
                        ButtonType = c.Int(nullable: false),
                        EntityType = c.Int(nullable: false),
                        PlacementCustomObjectKey = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.CustomLinksButtonPlacements", t => t.CustomLinksButtonPlacement_Id)
                .ForeignKey("dbo.CustomLinksUrls", t => t.CustomLinksUrl_Id)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId, cascadeDelete: true)
                .Index(t => t.CustomLinksButtonPlacement_Id)
                .Index(t => t.CustomLinksUrl_Id)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.CustomLinksButtonPlacements",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Key = c.String(),
                        Label = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CustomLinksUrls",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Key = c.String(),
                        Label = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Steps",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        StageId = c.Int(nullable: false),
                        Description = c.String(),
                        StepAction = c.Int(),
                        YellowFlagDays = c.Int(),
                        YellowFlagStart = c.Int(),
                        RedFlagDays = c.Int(),
                        RedFlagStart = c.Int(),
                        StepPercent = c.Int(nullable: false),
                        AssetId = c.Int(),
                        OrderInStage = c.Int(nullable: false),
                        Mandatory = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("Coaching.Assets", t => t.AssetId)
                .ForeignKey("dbo.Stages", t => t.StageId, cascadeDelete: true)
                .Index(t => t.StageId)
                .Index(t => t.AssetId);
            
            CreateTable(
                "Coaching.Assets",
                c => new
                    {
                        AssetId = c.Int(nullable: false, identity: true),
                        ChannelID = c.Int(nullable: false),
                        TypeID = c.Int(nullable: false),
                        ContentURL = c.String(nullable: false),
                        ContentTitle = c.String(nullable: false),
                        Description = c.String(nullable: false),
                        CreatedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        ImageFileName = c.String(maxLength: 50),
                        IsActive = c.Boolean(),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.AssetId)
                .ForeignKey("Coaching.AssetTypes", t => t.TypeID, cascadeDelete: true)
                .ForeignKey("Coaching.Channels", t => t.ChannelID, cascadeDelete: true)
                .Index(t => t.ChannelID)
                .Index(t => t.TypeID);
            
            CreateTable(
                "Coaching.AssetTags",
                c => new
                    {
                        AssetTagID = c.Int(nullable: false, identity: true),
                        AssetItemID = c.Int(nullable: false),
                        TagID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.AssetTagID)
                .ForeignKey("Coaching.Assets", t => t.AssetItemID, cascadeDelete: true)
                .ForeignKey("Coaching.Tags", t => t.TagID, cascadeDelete: true)
                .Index(t => t.AssetItemID)
                .Index(t => t.TagID);
            
            CreateTable(
                "Coaching.Tags",
                c => new
                    {
                        TagId = c.Int(nullable: false, identity: true),
                        BroadcasterId = c.Int(),
                        TagName = c.String(),
                        Deleted = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TagId)
                .ForeignKey("Coaching.Broadcasters", t => t.BroadcasterId)
                .Index(t => t.BroadcasterId);
            
            CreateTable(
                "Coaching.Broadcasters",
                c => new
                    {
                        BroadcasterID = c.Int(nullable: false, identity: true),
                        IsActive = c.Boolean(nullable: false),
                        BroadcasterName = c.String(nullable: false),
                        BroadcasterLevel = c.Int(nullable: false),
                        OrgId = c.Int(nullable: false),
                        StaId = c.Int(nullable: false),
                        ImageFileName = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.BroadcasterID);
            
            CreateTable(
                "Coaching.Channels",
                c => new
                    {
                        ChannelID = c.Int(nullable: false, identity: true),
                        BroadcasterID = c.Int(nullable: false),
                        ChannelName = c.String(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                        ImageFileName = c.String(maxLength: 50),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.ChannelID)
                .ForeignKey("Coaching.Broadcasters", t => t.BroadcasterID, cascadeDelete: true)
                .Index(t => t.BroadcasterID);
            
            CreateTable(
                "Coaching.Programs",
                c => new
                    {
                        ProgramID = c.Int(nullable: false, identity: true),
                        ChannelID = c.Int(nullable: false),
                        ProgramName = c.String(nullable: false),
                        ProgramDescription = c.String(nullable: false),
                        ImageFileName = c.String(maxLength: 50),
                        IsActive = c.Boolean(),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.ProgramID)
                .ForeignKey("Coaching.Channels", t => t.ChannelID, cascadeDelete: true)
                .Index(t => t.ChannelID);
            
            CreateTable(
                "Coaching.ProgramAssets",
                c => new
                    {
                        ProgramAssetId = c.Int(nullable: false, identity: true),
                        ProgramID = c.Int(nullable: false),
                        AssetID = c.Int(nullable: false),
                        StageOrder = c.Int(),
                    })
                .PrimaryKey(t => t.ProgramAssetId)
                .ForeignKey("Coaching.Assets", t => t.AssetID)
                .ForeignKey("Coaching.Programs", t => t.ProgramID)
                .Index(t => t.ProgramID)
                .Index(t => t.AssetID);
            
            CreateTable(
                "Coaching.AssetTypes",
                c => new
                    {
                        AssetTypeID = c.Int(nullable: false, identity: true),
                        AssetTypeName = c.String(nullable: false),
                        Accessor = c.String(nullable: false),
                        ContentType = c.String(),
                    })
                .PrimaryKey(t => t.AssetTypeID);
            
            CreateTable(
                "Coaching.UserFavorites",
                c => new
                    {
                        UserFavoriteID = c.Int(nullable: false, identity: true),
                        UserID = c.Int(nullable: false),
                        AssetItemID = c.Int(nullable: false),
                        FavoritesFolderID = c.Int(),
                        SortOrder = c.Int(),
                    })
                .PrimaryKey(t => t.UserFavoriteID)
                .ForeignKey("Coaching.Assets", t => t.AssetItemID, cascadeDelete: true)
                .ForeignKey("Coaching.UserFolders", t => t.FavoritesFolderID)
                .Index(t => t.AssetItemID)
                .Index(t => t.FavoritesFolderID);
            
            CreateTable(
                "Coaching.UserFolders",
                c => new
                    {
                        UserFolderID = c.Int(nullable: false, identity: true),
                        UserFolderName = c.String(nullable: false),
                        UserID = c.Int(nullable: false),
                        SortOrder = c.Int(),
                    })
                .PrimaryKey(t => t.UserFolderID);
            
            CreateTable(
                "Coaching.UserRatings",
                c => new
                    {
                        UserRatingID = c.Int(nullable: false, identity: true),
                        UserID = c.Int(nullable: false),
                        AssetItemID = c.Int(nullable: false),
                        Rating = c.Boolean(nullable: false),
                        RatedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.UserRatingID)
                .ForeignKey("Coaching.Assets", t => t.AssetItemID, cascadeDelete: true)
                .Index(t => t.AssetItemID);
            
            CreateTable(
                "Coaching.UserShares",
                c => new
                    {
                        UserShareId = c.Int(nullable: false, identity: true),
                        SharedByUserId = c.Int(nullable: false),
                        SharedToUserId = c.Int(nullable: false),
                        AssetId = c.Int(nullable: false),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        Message = c.String(),
                    })
                .PrimaryKey(t => t.UserShareId)
                .ForeignKey("Coaching.Assets", t => t.AssetId)
                .Index(t => t.AssetId);
            
            CreateTable(
                "dbo.LeadConversions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DealId = c.Int(nullable: false),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        DateLastModeified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                        ApprovalDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        Approved = c.Boolean(nullable: false),
                        FailureReason = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.Deals", t => t.DealId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .Index(t => t.DealId)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById);
            
            CreateTable(
                "dbo.LeadStatus",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Label = c.String(),
                        Key = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CustomFieldTypeGroup",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OrganisationId = c.Int(nullable: false),
                        FieldType = c.Int(nullable: false),
                        IsEnabled = c.Boolean(nullable: false),
                        DisplayOrder = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId, cascadeDelete: true)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.DealContactRoles",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        OrganisationId = c.Int(),
                        Accessor = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.DealContacts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DealId = c.Int(),
                        ContactId = c.Int(),
                        IsBuyingInfluence = c.Boolean(),
                        IsGoalKeeper = c.Boolean(),
                        PictureURL = c.String(),
                        LinkedInProfileURL = c.String(),
                        Support = c.String(),
                        Influence = c.String(),
                        Access = c.String(),
                        Role = c.String(),
                        X = c.String(),
                        Y = c.String(),
                        Manager = c.String(),
                        Influencees = c.String(),
                        DealContactRoleId = c.Int(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.EmailTemplates",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Subject = c.String(),
                        DocumentFieldCountentHtml = c.String(),
                        DocumentFieldCountentPlain = c.String(),
                        LanguageCode = c.String(),
                        OrganisationId = c.Int(),
                        Active = c.Boolean(nullable: false),
                        EmailTemplateConfiguration_TemplateID = c.String(maxLength: 128),
                        EmailTemplateConfigurationId = c.String(),
                        EmailType = c.Int(nullable: false),
                        CreatedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                        LastModified = c.DateTime(precision: 7, storeType: "datetime2"),
                        DeletedDate = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.EmailTemplateConfiguration", t => t.EmailTemplateConfiguration_TemplateID)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId)
                .Index(t => t.OrganisationId)
                .Index(t => t.EmailTemplateConfiguration_TemplateID);
            
            CreateTable(
                "dbo.EmailTemplateConfiguration",
                c => new
                    {
                        TemplateID = c.String(nullable: false, maxLength: 128),
                        AuthorID = c.String(),
                        AuthorName = c.String(),
                        Subject = c.String(),
                        Active = c.Boolean(),
                        EmailConfigurationID = c.Int(),
                        Optional = c.Boolean(),
                        HtmlTemplate = c.String(),
                        TextTemplate = c.String(),
                        OptionalEnabledByDefault = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TemplateID);
            
            CreateTable(
                "dbo.OrgEmailNotificiationPreferences",
                c => new
                    {
                        EmailTemplateConfigurationId = c.String(nullable: false, maxLength: 128),
                        OrgId = c.Int(nullable: false),
                        ReceiveEmail = c.Boolean(nullable: false),
                        Organisation_Id = c.Int(),
                    })
                .PrimaryKey(t => new { t.EmailTemplateConfigurationId, t.OrgId })
                .ForeignKey("dbo.EmailTemplateConfiguration", t => t.EmailTemplateConfigurationId, cascadeDelete: true)
                .ForeignKey("dbo.Organisations", t => t.Organisation_Id)
                .Index(t => t.EmailTemplateConfigurationId)
                .Index(t => t.Organisation_Id);
            
            CreateTable(
                "dbo.UserEmailNotificationPreferences",
                c => new
                    {
                        EmailTemplateConfigurationId = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ReceiveEmail = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => new { t.EmailTemplateConfigurationId, t.UserId })
                .ForeignKey("dbo.EmailTemplateConfiguration", t => t.EmailTemplateConfigurationId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.EmailTemplateConfigurationId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.IntegrationPackages",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                        HashedPassword = c.String(),
                        PasswordSalt = c.String(),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        DateLastModified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                        Organisation_Id = c.Int(),
                        Active = c.Boolean(nullable: false),
                        OriginalPackageId = c.Guid(nullable: false),
                        Installed = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .ForeignKey("dbo.Organisations", t => t.Organisation_Id)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById)
                .Index(t => t.Organisation_Id);
            
            CreateTable(
                "dbo.PackageItems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ItemId = c.Int(nullable: false),
                        ItemType = c.Int(nullable: false),
                        Package_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.IntegrationPackages", t => t.Package_Id)
                .Index(t => t.Package_Id);
            
            CreateTable(
                "dbo.Invites",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EmailAccessor = c.String(),
                        Email = c.String(),
                        Accepted = c.Boolean(),
                        UserId = c.String(maxLength: 128),
                        FirstName = c.String(),
                        LastName = c.String(),
                        OrganisationId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.UserId)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.OrganisationSalesObjectViews",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SalesObjectViewId = c.Int(nullable: false),
                        OrgId = c.Int(nullable: false),
                        Organisation_Id = c.Int(),
                        IsDefault = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organisations", t => t.Organisation_Id)
                .ForeignKey("dbo.SalesObjectViews", t => t.SalesObjectViewId, cascadeDelete: true)
                .Index(t => t.SalesObjectViewId)
                .Index(t => t.Organisation_Id);
            
            CreateTable(
                "dbo.SalesObjectViews",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SalesObject = c.String(),
                        ViewType = c.String(),
                        SideNavItemId = c.Int(),
                        IsDefault = c.Boolean(nullable: false),
                        OrgId = c.Int(),
                        StcId = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SideNavItems", t => t.SideNavItemId)
                .Index(t => t.SideNavItemId);
            
            CreateTable(
                "dbo.SalesObjectViewArchiveItems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SalesObjectViewArchiveId = c.Int(nullable: false),
                        SalesObjectViewId = c.Int(nullable: false),
                        IsDefault = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SalesObjectViews", t => t.SalesObjectViewId, cascadeDelete: true)
                .ForeignKey("dbo.SalesObjectViewArchives", t => t.SalesObjectViewArchiveId, cascadeDelete: true)
                .Index(t => t.SalesObjectViewArchiveId)
                .Index(t => t.SalesObjectViewId);
            
            CreateTable(
                "dbo.SalesObjectViewArchives",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OrganisationId = c.Int(nullable: false),
                        Name = c.String(),
                        Created = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId, cascadeDelete: true)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.SideNavItems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        Path = c.String(),
                        Icon = c.String(),
                        Template = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.SideNavSideNavItemLookups",
                c => new
                    {
                        SideNavId = c.Int(nullable: false),
                        SideNavItemId = c.Int(nullable: false),
                        Order = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.SideNavId, t.SideNavItemId })
                .ForeignKey("dbo.SideNavs", t => t.SideNavId, cascadeDelete: true)
                .ForeignKey("dbo.SideNavItems", t => t.SideNavItemId, cascadeDelete: true)
                .Index(t => t.SideNavId)
                .Index(t => t.SideNavItemId);
            
            CreateTable(
                "dbo.SideNavs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Route = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.PickLists",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Accessor = c.String(),
                        Name = c.String(),
                        MultipleSelections = c.Boolean(nullable: false),
                        MultipleSelectionsAllowed = c.Boolean(nullable: false),
                        OrganisationId = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.PickListOptions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        PickListId = c.Int(nullable: false),
                        OptionName = c.String(),
                        OptionValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.PickLists", t => t.PickListId, cascadeDelete: true)
                .Index(t => t.PickListId);
            
            CreateTable(
                "dbo.Rules",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        DateLastModeified = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedById = c.String(maxLength: 128),
                        LastModifiedById = c.String(maxLength: 128),
                        OrganisationId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.CreatedById)
                .ForeignKey("dbo.Users", t => t.LastModifiedById)
                .ForeignKey("dbo.Organisations", t => t.OrganisationId, cascadeDelete: true)
                .Index(t => t.CreatedById)
                .Index(t => t.LastModifiedById)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.Searches",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SerachType = c.Int(nullable: false),
                        SearchValue = c.String(),
                        RuleId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Rules", t => t.RuleId, cascadeDelete: true)
                .Index(t => t.RuleId);
            
            CreateTable(
                "dbo.Statements",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        ClassName = c.String(),
                        Amount = c.String(),
                        Rule_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Rules", t => t.Rule_Id, cascadeDelete: true)
                .Index(t => t.Rule_Id);
            
            CreateTable(
                "dbo.SalesTrainingCompanies",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Active = c.Boolean(nullable: false),
                        Created = c.DateTime(precision: 7, storeType: "datetime2"),
                        StcTheme_Id = c.Int(),
                        OrganisationId = c.Int(),
                        Subdomain = c.String(),
                        CustomHelpUrl = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.StcThemes", t => t.StcTheme_Id)
                .Index(t => t.StcTheme_Id);
            
            CreateTable(
                "dbo.StcOrgs",
                c => new
                    {
                        SalesTrainingCompanyId = c.Int(nullable: false),
                        OrganisationId = c.Int(nullable: false),
                        Priority = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.SalesTrainingCompanyId, t.OrganisationId })
                .ForeignKey("dbo.Organisations", t => t.OrganisationId, cascadeDelete: true)
                .ForeignKey("dbo.SalesTrainingCompanies", t => t.SalesTrainingCompanyId, cascadeDelete: true)
                .Index(t => t.SalesTrainingCompanyId)
                .Index(t => t.OrganisationId);
            
            CreateTable(
                "dbo.StcThemes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        NavBarBackgroundColour = c.String(),
                        Created = c.DateTime(precision: 7, storeType: "datetime2"),
                        CreatedUserId = c.String(),
                        LastUpdated = c.DateTime(precision: 7, storeType: "datetime2"),
                        LastUpdatedUserId = c.String(),
                        Name = c.String(),
                        LogoImage = c.Binary(maxLength: 8000),
                        CarotColour = c.String(),
                        HighlightedColour = c.String(),
                        TitleTextColour = c.String(),
                        ExternalReference = c.String(),
                        DefaultTheme = c.Boolean(nullable: false),
                        IsOrganisationTheme = c.Boolean(nullable: false),
                        SmallLogoImageByteArray144144 = c.Binary(maxLength: 8000),
                        SmallLogoImageByteArray114114 = c.Binary(maxLength: 8000),
                        SmallLogoImageByteArray7272 = c.Binary(maxLength: 8000),
                        SmallLogoImageByteArray5757 = c.Binary(maxLength: 8000),
                        BoxHeaderBackgroundColour = c.String(),
                        BoxHeaderTextColour = c.String(),
                        SelectedNavStateTextColour = c.String(),
                        DropDownListBackgoundHover = c.String(),
                        DropDownListTextHoverColour = c.String(),
                        MobileLogoImageByteArray = c.Binary(maxLength: 8000),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Subscriptions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EditionId = c.Int(nullable: false),
                        GracePeriodDays = c.Int(nullable: false),
                        BillingCurrency = c.String(),
                        BasePrice = c.Decimal(nullable: false, precision: 18, scale: 2),
                        PricePerUser = c.Decimal(nullable: false, precision: 18, scale: 2),
                        BillDayOfMonth = c.Int(nullable: false),
                        BraintreeSubscriptionId = c.String(),
                        ActiveAccount = c.Boolean(nullable: false),
                        TrialExpires = c.DateTime(precision: 7, storeType: "datetime2"),
                        AccountCanceled = c.DateTime(precision: 7, storeType: "datetime2"),
                        PayedEditionTrialPeriodUsed = c.Boolean(nullable: false),
                        PerpetualTrial = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Editions", t => t.EditionId, cascadeDelete: true)
                .Index(t => t.EditionId);
            
            CreateTable(
                "dbo.Editions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Status = c.Int(nullable: false),
                        EditionLevel = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AddOns",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AddOnId = c.String(),
                        Version = c.String(),
                        Name = c.String(),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AddOnClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AddOnId = c.Int(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                        ClaimType = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AddOns", t => t.AddOnId)
                .Index(t => t.AddOnId);
            
            CreateTable(
                "dbo.AddOnClaimValues",
                c => new
                    {
                        SubscriptionAddOnId = c.Int(nullable: false),
                        AddOnClaimId = c.Int(nullable: false),
                        Value = c.String(),
                    })
                .PrimaryKey(t => new { t.SubscriptionAddOnId, t.AddOnClaimId })
                .ForeignKey("dbo.AddOnClaims", t => t.AddOnClaimId, cascadeDelete: true)
                .ForeignKey("dbo.SubscriptionAddOns", t => t.SubscriptionAddOnId, cascadeDelete: true)
                .Index(t => t.SubscriptionAddOnId)
                .Index(t => t.AddOnClaimId);
            
            CreateTable(
                "dbo.SubscriptionAddOns",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SubscriptionId = c.Int(nullable: false),
                        AddOnId = c.Int(nullable: false),
                        AddOnCostId = c.Int(),
                        GracePeriodDays = c.Int(nullable: false),
                        TrialExpires = c.DateTime(precision: 7, storeType: "datetime2"),
                        IsDefaultAddOn = c.Boolean(nullable: false),
                        BillDayOfMonth = c.Int(nullable: false),
                        BraintreeSubscriptionId = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AddOns", t => t.AddOnId, cascadeDelete: true)
                .ForeignKey("dbo.AddOnCosts", t => t.AddOnCostId)
                .ForeignKey("dbo.Subscriptions", t => t.SubscriptionId, cascadeDelete: true)
                .Index(t => t.SubscriptionId)
                .Index(t => t.AddOnId)
                .Index(t => t.AddOnCostId);
            
            CreateTable(
                "dbo.AddOnCosts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AddOnId = c.Int(nullable: false),
                        LastUpdated = c.DateTime(precision: 7, storeType: "datetime2"),
                        Currency = c.String(),
                        Cost = c.Decimal(nullable: false, precision: 18, scale: 2),
                        BraintreePlanId = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AddOns", t => t.AddOnId)
                .Index(t => t.AddOnId);
            
            CreateTable(
                "dbo.EditionCosts",
                c => new
                    {
                        EditionCostId = c.Int(nullable: false, identity: true),
                        LastUpdated = c.DateTime(precision: 7, storeType: "datetime2"),
                        Currency = c.String(),
                        Cost = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Edition_Id = c.Int(),
                        BraintreePlanId = c.String(),
                    })
                .PrimaryKey(t => t.EditionCostId)
                .ForeignKey("dbo.Editions", t => t.Edition_Id)
                .Index(t => t.Edition_Id);
            
            CreateTable(
                "dbo.Features",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                        ClientFacing = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.FeatureClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FeatureId = c.Int(nullable: false),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Features", t => t.FeatureId, cascadeDelete: true)
                .Index(t => t.FeatureId);
            
            CreateTable(
                "dbo.Groups",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        OrgId = c.Int(nullable: false),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.LogoImages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Image = c.Binary(maxLength: 8000),
                        AccountId = c.Int(),
                        Discriminator = c.String(nullable: false, maxLength: 128),
                        ContactId = c.Int(),
                        UserId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.AccountId)
                .ForeignKey("dbo.Contacts", t => t.ContactId)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.AccountId)
                .Index(t => t.ContactId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Notifications",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        TableName = c.String(),
                        UserId = c.String(maxLength: 128),
                        Actions = c.String(),
                        TableIdValue = c.Long(nullable: false),
                        UpdateDate = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.NotificationFields",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FieldName = c.String(),
                        OldValue = c.String(),
                        NewValue = c.String(),
                        Notification_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Notifications", t => t.Notification_Id)
                .Index(t => t.Notification_Id);
            
            CreateTable(
                "dbo.OAuth2Token",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OAuth2TokenType = c.Int(nullable: false),
                        CreatedDateTime = c.DateTime(precision: 7, storeType: "datetime2"),
                        User_Id = c.String(maxLength: 128),
                        AccessToken = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.User_Id)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.PasswordResetRequests",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(maxLength: 128),
                        Used = c.Boolean(nullable: false),
                        Expiry = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.UserId)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.SystemPreferences",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.TablePreferences",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        SystemPreferences_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SystemPreferences", t => t.SystemPreferences_Id)
                .Index(t => t.SystemPreferences_Id);
            
            CreateTable(
                "dbo.ColumnPreferences",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Visible = c.Boolean(nullable: false),
                        TablePreference_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.TablePreferences", t => t.TablePreference_Id)
                .Index(t => t.TablePreference_Id);
            
            CreateTable(
                "dbo.UserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                        IdentityUser_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.IdentityUser_Id)
                .Index(t => t.IdentityUser_Id);
            
            CreateTable(
                "dbo.UserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                        IdentityUser_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.Users", t => t.IdentityUser_Id)
                .Index(t => t.IdentityUser_Id);
            
            CreateTable(
                "dbo.UserProfiles",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Culture = c.String(),
                        Timezone = c.String(),
                        Currency = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                        IdentityUser_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.Roles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.IdentityUser_Id)
                .Index(t => t.RoleId)
                .Index(t => t.IdentityUser_Id);
            
            CreateTable(
                "dbo.Roles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.RoleClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                        ApplicationRoleId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Roles", t => t.ApplicationRoleId)
                .Index(t => t.ApplicationRoleId);
            
            CreateTable(
                "dbo.UserTargets",
                c => new
                    {
                        UserTargetId = c.Int(nullable: false, identity: true),
                        TargetAmount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        StartDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        EndDate = c.DateTime(nullable: false, precision: 7, storeType: "datetime2"),
                        User_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.UserTargetId)
                .ForeignKey("dbo.Users", t => t.User_Id)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.AccountShares",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(),
                        DateShared = c.DateTime(precision: 7, storeType: "datetime2"),
                        Account_Id = c.Int(),
                        Writable = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Accounts", t => t.Account_Id)
                .Index(t => t.Account_Id);
            
            CreateTable(
                "dbo.ApiConnectors",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        ConnectorEndPoint = c.String(),
                        ApiEndPoint = c.String(),
                        ExternalCodeSetupEndPoint = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ExternalIntegrations",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OrganisationId = c.Int(nullable: false),
                        ApiConnectorId = c.Int(nullable: false),
                        Enabled = c.Boolean(nullable: false),
                        Username = c.String(),
                        Password = c.String(),
                        ExternalOrganisationId = c.String(),
                        CustomScript = c.String(),
                        CustomUserScript = c.String(),
                        ImportMissingUsers = c.Boolean(),
                        DailyBulkUpdateEnabled = c.Boolean(),
                        BulkUpdateTime = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ApiConnectors", t => t.ApiConnectorId, cascadeDelete: true)
                .Index(t => t.ApiConnectorId);
            
            CreateTable(
                "dbo.ExternalIntegrationTypeMappings",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EntityType = c.String(),
                        ExternalIntegrationId = c.Int(nullable: false),
                        CustomObjectKey = c.String(),
                        AssociatedType = c.String(),
                        DirectionalSyncEnabled = c.Boolean(nullable: false),
                        DirectionalSyncUpEnabled = c.Boolean(nullable: false),
                        DirectionalSyncDownEnabled = c.Boolean(nullable: false),
                        DailyBulkSyncEnabled = c.Boolean(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ExternalIntegrations", t => t.ExternalIntegrationId, cascadeDelete: true)
                .Index(t => t.ExternalIntegrationId);
            
            CreateTable(
                "dbo.ExternalIntegrationFieldMappings",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ExternalIntegrationTypeMappingId = c.Int(nullable: false),
                        ExternalField = c.String(),
                        VrField = c.String(),
                        DirectionalSyncUpRule = c.String(),
                        DirectionalSyncDownRule = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ExternalIntegrationTypeMappings", t => t.ExternalIntegrationTypeMappingId, cascadeDelete: true)
                .Index(t => t.ExternalIntegrationTypeMappingId);
            
            CreateTable(
                "dbo.ApiTypeImportQueueItems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RecordType = c.String(),
                        BatchId = c.String(),
                        JobId = c.String(),
                        UserId = c.String(),
                        CustomObjectKey = c.String(),
                        ExternalIntegrationId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "Coaching.Admin_ConnectorLog",
                c => new
                    {
                        ConnectorLogID = c.Int(nullable: false),
                        RequestType = c.String(maxLength: 50),
                        URL = c.String(),
                        RequestXML = c.String(),
                        ResponseXML = c.String(),
                        OrgID = c.Int(),
                        AppletID = c.Int(),
                        TimeStamp = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.ConnectorLogID);
            
            CreateTable(
                "Coaching.Admin_EventLog",
                c => new
                    {
                        EventLogID = c.Int(nullable: false),
                        Description = c.String(nullable: false, maxLength: 128),
                        EventTypeID = c.String(nullable: false, maxLength: 100),
                    })
                .PrimaryKey(t => new { t.EventLogID, t.Description, t.EventTypeID });
            
            CreateTable(
                "Coaching.CoachingUser",
                c => new
                    {
                        CoachingUserID = c.Int(nullable: false, identity: true),
                        IsActive = c.Boolean(),
                        DateCreated = c.DateTime(precision: 7, storeType: "datetime2"),
                        OrgID = c.Int(),
                        GatewayUserID = c.Int(nullable: false),
                        BroadcasterId = c.Int(),
                        StaId = c.Int(),
                        ContentSharing = c.Boolean(),
                        SharemMyUsageWithMyOrg = c.Boolean(),
                        UserID = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.CoachingUserID);
            
            CreateTable(
                "Coaching.UserViews",
                c => new
                    {
                        UserViewId = c.Int(nullable: false, identity: true),
                        CoachingUserId = c.Int(nullable: false),
                        AssetId = c.Int(nullable: false),
                        DateViwed = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.UserViewId)
                .ForeignKey("Coaching.CoachingUser", t => t.CoachingUserId)
                .Index(t => t.CoachingUserId);
            
            CreateTable(
                "Coaching.StaThemes",
                c => new
                    {
                        StaThemeId = c.Int(nullable: false),
                        StaId = c.Int(nullable: false),
                        ThemeId = c.Int(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                        PageTitle = c.String(maxLength: 200),
                        StaUrl = c.String(maxLength: 255),
                    })
                .PrimaryKey(t => new { t.StaThemeId, t.StaId, t.ThemeId, t.IsActive });
            
            CreateTable(
                "Coaching.Themes",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        EmailConfiguration = c.Int(nullable: false),
                        UniqueName = c.String(nullable: false, maxLength: 30),
                    })
                .PrimaryKey(t => new { t.Id, t.EmailConfiguration, t.UniqueName });
            
            CreateTable(
                "dbo.CountryLists",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        IsoCode = c.String(),
                        Name = c.String(),
                        Aliases = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CurrencyAmounts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CurrencyCode = c.String(),
                        Amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.CustomLinksApiTypes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Key = c.String(),
                        Label = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.DealOrgCharts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DealId = c.Int(nullable: false),
                        ChartZoom = c.Double(nullable: false),
                        X = c.Int(nullable: false),
                        Y = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.DefaultAddOnInEditions",
                c => new
                    {
                        AddOnId = c.Int(nullable: false),
                        EditionId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.AddOnId, t.EditionId });
            
            CreateTable(
                "dbo.EmailConfiguration",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Description = c.String(),
                        ApiUserName = c.String(),
                        APIPassword = c.String(),
                        DomainAddressID = c.String(),
                        EmailConnectorURL = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.EmailNotifications",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        EmailType = c.Int(nullable: false),
                        SentEmailDateTime = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => new { t.UserId, t.EmailType });
            
            CreateTable(
                "dbo.ExchangeRates",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Date = c.DateTime(precision: 7, storeType: "datetime2"),
                        CurrencyCode = c.String(),
                        RateAgainstEuro = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "IdenServ.ClientClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Type = c.String(nullable: false, maxLength: 250),
                        Value = c.String(nullable: false, maxLength: 250),
                        Client_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("IdenServ.Clients", t => t.Client_Id)
                .Index(t => t.Client_Id);
            
            CreateTable(
                "IdenServ.Clients",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Enabled = c.Boolean(nullable: false),
                        ClientId = c.String(nullable: false, maxLength: 200),
                        ClientName = c.String(nullable: false, maxLength: 200),
                        ClientUri = c.String(maxLength: 2000),
                        LogoUri = c.String(),
                        RequireConsent = c.Boolean(nullable: false),
                        AllowRememberConsent = c.Boolean(nullable: false),
                        Flow = c.Int(nullable: false),
                        AllowClientCredentialsOnly = c.Boolean(nullable: false),
                        LogoutUri = c.String(),
                        LogoutSessionRequired = c.Boolean(nullable: false),
                        RequireSignOutPrompt = c.Boolean(nullable: false),
                        AllowAccessToAllScopes = c.Boolean(nullable: false),
                        IdentityTokenLifetime = c.Int(nullable: false),
                        AccessTokenLifetime = c.Int(nullable: false),
                        AuthorizationCodeLifetime = c.Int(nullable: false),
                        AbsoluteRefreshTokenLifetime = c.Int(nullable: false),
                        SlidingRefreshTokenLifetime = c.Int(nullable: false),
                        RefreshTokenUsage = c.Int(nullable: false),
                        UpdateAccessTokenOnRefresh = c.Boolean(nullable: false),
                        RefreshTokenExpiration = c.Int(nullable: false),
                        AccessTokenType = c.Int(nullable: false),
                        EnableLocalLogin = c.Boolean(nullable: false),
                        IncludeJwtId = c.Boolean(nullable: false),
                        AlwaysSendClientClaims = c.Boolean(nullable: false),
                        PrefixClientClaims = c.Boolean(nullable: false),
                        AllowAccessToAllGrantTypes = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "IdenServ.ClientCorsOrigins",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Origin = c.String(nullable: false, maxLength: 150),
                        Client_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("IdenServ.Clients", t => t.Client_Id)
                .Index(t => t.Client_Id);
            
            CreateTable(
                "IdenServ.ClientCustomGrantTypes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        GrantType = c.String(nullable: false, maxLength: 250),
                        Client_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("IdenServ.Clients", t => t.Client_Id)
                .Index(t => t.Client_Id);
            
            CreateTable(
                "IdenServ.ClientIdPRestrictions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Provider = c.String(nullable: false, maxLength: 200),
                        Client_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("IdenServ.Clients", t => t.Client_Id)
                .Index(t => t.Client_Id);
            
            CreateTable(
                "IdenServ.ClientPostLogoutRedirectUris",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Uri = c.String(nullable: false, maxLength: 2000),
                        Client_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("IdenServ.Clients", t => t.Client_Id)
                .Index(t => t.Client_Id);
            
            CreateTable(
                "IdenServ.ClientRedirectUris",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Uri = c.String(nullable: false, maxLength: 2000),
                        Client_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("IdenServ.Clients", t => t.Client_Id)
                .Index(t => t.Client_Id);
            
            CreateTable(
                "IdenServ.ClientScopes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Scope = c.String(nullable: false, maxLength: 200),
                        Client_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("IdenServ.Clients", t => t.Client_Id)
                .Index(t => t.Client_Id);
            
            CreateTable(
                "IdenServ.ClientSecrets",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Value = c.String(nullable: false, maxLength: 250),
                        Type = c.String(maxLength: 250),
                        Description = c.String(maxLength: 2000),
                        Expiration = c.DateTimeOffset(precision: 7),
                        Client_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("IdenServ.Clients", t => t.Client_Id)
                .Index(t => t.Client_Id);
            
            CreateTable(
                "IdenServ.Consents",
                c => new
                    {
                        Subject = c.String(nullable: false, maxLength: 200),
                        ClientId = c.String(nullable: false, maxLength: 200),
                        Scopes = c.String(nullable: false, maxLength: 2000),
                    })
                .PrimaryKey(t => new { t.Subject, t.ClientId });
            
            CreateTable(
                "IdenServ.ScopeClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 200),
                        Description = c.String(maxLength: 1000),
                        AlwaysIncludeInIdToken = c.Boolean(nullable: false),
                        Scope_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("IdenServ.Scopes", t => t.Scope_Id)
                .Index(t => t.Scope_Id);
            
            CreateTable(
                "IdenServ.Scopes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Enabled = c.Boolean(nullable: false),
                        Name = c.String(nullable: false, maxLength: 200),
                        DisplayName = c.String(maxLength: 200),
                        Description = c.String(maxLength: 1000),
                        Required = c.Boolean(nullable: false),
                        Emphasize = c.Boolean(nullable: false),
                        Type = c.Int(nullable: false),
                        IncludeAllClaimsForUser = c.Boolean(nullable: false),
                        ClaimsRule = c.String(maxLength: 200),
                        ShowInDiscoveryDocument = c.Boolean(nullable: false),
                        AllowUnrestrictedIntrospection = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "IdenServ.ScopeSecrets",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Description = c.String(maxLength: 1000),
                        Expiration = c.DateTimeOffset(precision: 7),
                        Type = c.String(maxLength: 250),
                        Value = c.String(nullable: false, maxLength: 250),
                        Scope_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("IdenServ.Scopes", t => t.Scope_Id)
                .Index(t => t.Scope_Id);
            
            CreateTable(
                "IdenServ.Tokens",
                c => new
                    {
                        Key = c.String(nullable: false, maxLength: 128),
                        TokenType = c.Short(nullable: false),
                        SubjectId = c.String(maxLength: 200),
                        ClientId = c.String(nullable: false, maxLength: 200),
                        JsonCode = c.String(nullable: false),
                        Expiry = c.DateTimeOffset(nullable: false, precision: 7),
                    })
                .PrimaryKey(t => new { t.Key, t.TokenType });
            
            CreateTable(
                "dbo.ImportedDatas",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RecordId = c.String(),
                        RecordType = c.String(),
                        DateImported = c.DateTime(precision: 7, storeType: "datetime2"),
                        OrganisationId = c.Int(),
                        RecordName = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Localizations",
                c => new
                    {
                        pk = c.Int(nullable: false, identity: true),
                        ResourceId = c.String(nullable: false, maxLength: 1024),
                        Value = c.String(),
                        LocaleId = c.String(maxLength: 30),
                        ResourceSet = c.String(maxLength: 512),
                        Type = c.String(maxLength: 512),
                        BinFile = c.Binary(maxLength: 8000),
                        TextFile = c.String(),
                        Filename = c.String(maxLength: 128),
                        Comment = c.String(maxLength: 512),
                        ValueType = c.Int(nullable: false),
                        Updated = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.pk);
            
            CreateTable(
                "dbo.MaintenanceSchedules",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Reason = c.String(),
                        Start = c.DateTime(precision: 7, storeType: "datetime2"),
                        ExpectedFinish = c.DateTime(precision: 7, storeType: "datetime2"),
                        ActualFinish = c.DateTime(precision: 7, storeType: "datetime2"),
                        Status = c.Int(nullable: false),
                        NotifyFrom = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.MeetingVisualiserChartItems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TaskId = c.Int(nullable: false),
                        Type = c.String(),
                        X = c.Int(nullable: false),
                        Y = c.Int(nullable: false),
                        Width = c.Int(nullable: false),
                        Height = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.StepActionFiles",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FileName = c.String(),
                        OriginalFileName = c.String(),
                        ContentType = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.tempNotificationFields",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        FieldName = c.String(),
                        OldValue = c.String(),
                        NewValue = c.String(),
                        Notification_Id = c.Long(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.tempNotifications",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        TableIdValue = c.Long(nullable: false),
                        TableName = c.String(),
                        UserId = c.String(maxLength: 128),
                        Actions = c.String(),
                        UpdateDate = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => new { t.Id, t.TableIdValue });
            
            CreateTable(
                "dbo.UsageLevels",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        RequiredPoints = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.WatchNotificationEmails",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(),
                        WatchedEntityType = c.Int(nullable: false),
                        WatchedEntityId = c.Int(nullable: false),
                        LastNotified = c.DateTime(precision: 7, storeType: "datetime2"),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.DealWatchingUsers",
                c => new
                    {
                        WatchedDealId = c.Int(nullable: false),
                        WatchingUserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.WatchedDealId, t.WatchingUserId })
                .ForeignKey("dbo.Deals", t => t.WatchedDealId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.WatchingUserId, cascadeDelete: true)
                .Index(t => t.WatchedDealId)
                .Index(t => t.WatchingUserId);
            
            CreateTable(
                "dbo.DealContactRoleDealContacts",
                c => new
                    {
                        DealContact_Id = c.Int(nullable: false),
                        DealContactRole_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.DealContact_Id, t.DealContactRole_Id })
                .ForeignKey("dbo.DealContacts", t => t.DealContact_Id, cascadeDelete: true)
                .ForeignKey("dbo.DealContactRoles", t => t.DealContactRole_Id, cascadeDelete: true)
                .Index(t => t.DealContact_Id)
                .Index(t => t.DealContactRole_Id);
            
            CreateTable(
                "dbo.DefaultAddOnInEdition",
                c => new
                    {
                        AddOnId = c.Int(nullable: false),
                        EditionId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.AddOnId, t.EditionId })
                .ForeignKey("dbo.AddOns", t => t.AddOnId, cascadeDelete: true)
                .ForeignKey("dbo.Editions", t => t.EditionId, cascadeDelete: true)
                .Index(t => t.AddOnId)
                .Index(t => t.EditionId);
            
            CreateTable(
                "dbo.FeatureEditions",
                c => new
                    {
                        Edition_Id = c.Int(nullable: false),
                        Feature_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Edition_Id, t.Feature_Id })
                .ForeignKey("dbo.Editions", t => t.Edition_Id, cascadeDelete: true)
                .ForeignKey("dbo.Features", t => t.Feature_Id, cascadeDelete: true)
                .Index(t => t.Edition_Id)
                .Index(t => t.Feature_Id);
            
            CreateTable(
                "dbo.GroupUsers",
                c => new
                    {
                        Group_Id = c.Int(nullable: false),
                        User_Id = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.Group_Id, t.User_Id })
                .ForeignKey("dbo.Groups", t => t.Group_Id, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.User_Id, cascadeDelete: true)
                .Index(t => t.Group_Id)
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.AccountWatchingUsers",
                c => new
                    {
                        WatchedAccountId = c.Int(nullable: false),
                        WatchingUserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.WatchedAccountId, t.WatchingUserId })
                .ForeignKey("dbo.Accounts", t => t.WatchedAccountId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.WatchingUserId, cascadeDelete: true)
                .Index(t => t.WatchedAccountId)
                .Index(t => t.WatchingUserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("IdenServ.ScopeClaims", "Scope_Id", "IdenServ.Scopes");
            DropForeignKey("IdenServ.ScopeSecrets", "Scope_Id", "IdenServ.Scopes");
            DropForeignKey("IdenServ.ClientClaims", "Client_Id", "IdenServ.Clients");
            DropForeignKey("IdenServ.ClientSecrets", "Client_Id", "IdenServ.Clients");
            DropForeignKey("IdenServ.ClientScopes", "Client_Id", "IdenServ.Clients");
            DropForeignKey("IdenServ.ClientRedirectUris", "Client_Id", "IdenServ.Clients");
            DropForeignKey("IdenServ.ClientPostLogoutRedirectUris", "Client_Id", "IdenServ.Clients");
            DropForeignKey("IdenServ.ClientIdPRestrictions", "Client_Id", "IdenServ.Clients");
            DropForeignKey("IdenServ.ClientCustomGrantTypes", "Client_Id", "IdenServ.Clients");
            DropForeignKey("IdenServ.ClientCorsOrigins", "Client_Id", "IdenServ.Clients");
            DropForeignKey("Coaching.UserViews", "CoachingUserId", "Coaching.CoachingUser");
            DropForeignKey("dbo.ExternalIntegrationFieldMappings", "ExternalIntegrationTypeMappingId", "dbo.ExternalIntegrationTypeMappings");
            DropForeignKey("dbo.ExternalIntegrationTypeMappings", "ExternalIntegrationId", "dbo.ExternalIntegrations");
            DropForeignKey("dbo.ExternalIntegrations", "ApiConnectorId", "dbo.ApiConnectors");
            DropForeignKey("dbo.AccountWatchingUsers", "WatchingUserId", "dbo.Users");
            DropForeignKey("dbo.AccountWatchingUsers", "WatchedAccountId", "dbo.Accounts");
            DropForeignKey("dbo.Accounts", "StageId", "dbo.Stages");
            DropForeignKey("dbo.Accounts", "SalesProcessId", "dbo.SalesProcesses");
            DropForeignKey("dbo.Accounts", "OwnerId", "dbo.Users");
            DropForeignKey("dbo.Accounts", "LogoImage_Id", "dbo.LogoImages");
            DropForeignKey("dbo.Accounts", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.Accounts", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.AccountShares", "Account_Id", "dbo.Accounts");
            DropForeignKey("dbo.StepDocuments", "TaskId", "dbo.Tasks");
            DropForeignKey("dbo.StepDocuments", "StepId", "dbo.Steps");
            DropForeignKey("dbo.StepDocuments", "PartnerId", "dbo.Accounts");
            DropForeignKey("dbo.StepDocuments", "LeadId", "dbo.Deals");
            DropForeignKey("dbo.StepDocuments", "DealId", "dbo.Deals");
            DropForeignKey("dbo.StepDocuments", "CustomTableRowId", "dbo.CustomObjectRows");
            DropForeignKey("dbo.StepDocuments", "Contact_Id", "dbo.Contacts");
            DropForeignKey("dbo.Contacts", "StageId", "dbo.Stages");
            DropForeignKey("dbo.Contacts", "SalesProcessId", "dbo.SalesProcesses");
            DropForeignKey("dbo.Contacts", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.Contacts", "LogoImage_Id", "dbo.LogoImages");
            DropForeignKey("dbo.Contacts", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.Contacts", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.UserTargets", "User_Id", "dbo.Users");
            DropForeignKey("dbo.UserRoles", "IdentityUser_Id", "dbo.Users");
            DropForeignKey("dbo.UserRoles", "RoleId", "dbo.Roles");
            DropForeignKey("dbo.RoleClaims", "ApplicationRoleId", "dbo.Roles");
            DropForeignKey("dbo.Users", "UserProfileId", "dbo.UserProfiles");
            DropForeignKey("dbo.UserLogins", "IdentityUser_Id", "dbo.Users");
            DropForeignKey("dbo.UserClaims", "IdentityUser_Id", "dbo.Users");
            DropForeignKey("dbo.Users", "Task_Id", "dbo.Tasks");
            DropForeignKey("dbo.Users", "SystemPreferences_Id", "dbo.SystemPreferences");
            DropForeignKey("dbo.TablePreferences", "SystemPreferences_Id", "dbo.SystemPreferences");
            DropForeignKey("dbo.ColumnPreferences", "TablePreference_Id", "dbo.TablePreferences");
            DropForeignKey("dbo.PasswordResetRequests", "UserId", "dbo.Users");
            DropForeignKey("dbo.Users", "Organisation_Id", "dbo.Organisations");
            DropForeignKey("dbo.OAuth2Token", "User_Id", "dbo.Users");
            DropForeignKey("dbo.Notifications", "UserId", "dbo.Users");
            DropForeignKey("dbo.NotificationFields", "Notification_Id", "dbo.Notifications");
            DropForeignKey("dbo.Users", "ManagerId", "dbo.Users");
            DropForeignKey("dbo.Users", "LogoImage_Id", "dbo.LogoImages");
            DropForeignKey("dbo.LogoImages", "UserId", "dbo.Users");
            DropForeignKey("dbo.LogoImages", "ContactId", "dbo.Contacts");
            DropForeignKey("dbo.LogoImages", "AccountId", "dbo.Accounts");
            DropForeignKey("dbo.GroupUsers", "User_Id", "dbo.Users");
            DropForeignKey("dbo.GroupUsers", "Group_Id", "dbo.Groups");
            DropForeignKey("dbo.ApiKeys", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.Organisations", "Subscription_Id", "dbo.Subscriptions");
            DropForeignKey("dbo.Subscriptions", "EditionId", "dbo.Editions");
            DropForeignKey("dbo.FeatureEditions", "Feature_Id", "dbo.Features");
            DropForeignKey("dbo.FeatureEditions", "Edition_Id", "dbo.Editions");
            DropForeignKey("dbo.FeatureClaims", "FeatureId", "dbo.Features");
            DropForeignKey("dbo.EditionCosts", "Edition_Id", "dbo.Editions");
            DropForeignKey("dbo.DefaultAddOnInEdition", "EditionId", "dbo.Editions");
            DropForeignKey("dbo.DefaultAddOnInEdition", "AddOnId", "dbo.AddOns");
            DropForeignKey("dbo.AddOnClaimValues", "SubscriptionAddOnId", "dbo.SubscriptionAddOns");
            DropForeignKey("dbo.SubscriptionAddOns", "SubscriptionId", "dbo.Subscriptions");
            DropForeignKey("dbo.SubscriptionAddOns", "AddOnCostId", "dbo.AddOnCosts");
            DropForeignKey("dbo.AddOnCosts", "AddOnId", "dbo.AddOns");
            DropForeignKey("dbo.SubscriptionAddOns", "AddOnId", "dbo.AddOns");
            DropForeignKey("dbo.AddOnClaimValues", "AddOnClaimId", "dbo.AddOnClaims");
            DropForeignKey("dbo.AddOnClaims", "AddOnId", "dbo.AddOns");
            DropForeignKey("dbo.Organisations", "OrganisationTheme_Id", "dbo.StcThemes");
            DropForeignKey("dbo.Organisations", "IsStc_Id", "dbo.SalesTrainingCompanies");
            DropForeignKey("dbo.SalesTrainingCompanies", "StcTheme_Id", "dbo.StcThemes");
            DropForeignKey("dbo.StcOrgs", "SalesTrainingCompanyId", "dbo.SalesTrainingCompanies");
            DropForeignKey("dbo.StcOrgs", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.Statements", "Rule_Id", "dbo.Rules");
            DropForeignKey("dbo.Searches", "RuleId", "dbo.Rules");
            DropForeignKey("dbo.Rules", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.Rules", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.Rules", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.PickListOptions", "PickListId", "dbo.PickLists");
            DropForeignKey("dbo.PickLists", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.OrganisationSalesObjectViews", "SalesObjectViewId", "dbo.SalesObjectViews");
            DropForeignKey("dbo.SalesObjectViews", "SideNavItemId", "dbo.SideNavItems");
            DropForeignKey("dbo.SideNavSideNavItemLookups", "SideNavItemId", "dbo.SideNavItems");
            DropForeignKey("dbo.SideNavSideNavItemLookups", "SideNavId", "dbo.SideNavs");
            DropForeignKey("dbo.SalesObjectViewArchiveItems", "SalesObjectViewArchiveId", "dbo.SalesObjectViewArchives");
            DropForeignKey("dbo.SalesObjectViewArchives", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.SalesObjectViewArchiveItems", "SalesObjectViewId", "dbo.SalesObjectViews");
            DropForeignKey("dbo.OrganisationSalesObjectViews", "Organisation_Id", "dbo.Organisations");
            DropForeignKey("dbo.Organisations", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.Invites", "UserId", "dbo.Users");
            DropForeignKey("dbo.Invites", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.PackageItems", "Package_Id", "dbo.IntegrationPackages");
            DropForeignKey("dbo.IntegrationPackages", "Organisation_Id", "dbo.Organisations");
            DropForeignKey("dbo.IntegrationPackages", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.IntegrationPackages", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.EmailTemplates", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.EmailTemplates", "EmailTemplateConfiguration_TemplateID", "dbo.EmailTemplateConfiguration");
            DropForeignKey("dbo.UserEmailNotificationPreferences", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserEmailNotificationPreferences", "EmailTemplateConfigurationId", "dbo.EmailTemplateConfiguration");
            DropForeignKey("dbo.OrgEmailNotificiationPreferences", "Organisation_Id", "dbo.Organisations");
            DropForeignKey("dbo.OrgEmailNotificiationPreferences", "EmailTemplateConfigurationId", "dbo.EmailTemplateConfiguration");
            DropForeignKey("dbo.DealContactRoles", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.DealContactRoleDealContacts", "DealContactRole_Id", "dbo.DealContactRoles");
            DropForeignKey("dbo.DealContactRoleDealContacts", "DealContact_Id", "dbo.DealContacts");
            DropForeignKey("dbo.CustomFieldTypeGroup", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.CustomFieldGroups", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.CustomFields", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.CustomFields", "CustomObjectRow_Id", "dbo.CustomObjectRows");
            DropForeignKey("dbo.CustomFields", "CustomObject_Id", "dbo.CustomObjects");
            DropForeignKey("dbo.CustomObjects", "Organisation_Id", "dbo.Organisations");
            DropForeignKey("dbo.CustomObjects", "LastModifiedBy_Id", "dbo.Users");
            DropForeignKey("dbo.CustomObjectRows", "StageId", "dbo.Stages");
            DropForeignKey("dbo.CustomObjectRows", "SalesProcessId", "dbo.SalesProcesses");
            DropForeignKey("dbo.CustomObjectRows", "OwnerId", "dbo.Users");
            DropForeignKey("dbo.CustomObjectRows", "Organisation_Id", "dbo.Organisations");
            DropForeignKey("dbo.CustomObjectRows", "LastModifiedBy_Id", "dbo.Users");
            DropForeignKey("dbo.ItemSteps", "TaskId", "dbo.Tasks");
            DropForeignKey("dbo.ItemSteps", "StepId", "dbo.Steps");
            DropForeignKey("dbo.ItemSteps", "ReminderTaskId", "dbo.ReminderTasks");
            DropForeignKey("dbo.ReminderTasks", "TaskId", "dbo.Tasks");
            DropForeignKey("dbo.DealSteps", "StepId", "dbo.Steps");
            DropForeignKey("dbo.DealSteps", "ReminderTaskId", "dbo.ReminderTasks");
            DropForeignKey("dbo.DealSteps", "DealId", "dbo.Deals");
            DropForeignKey("dbo.DealWatchingUsers", "WatchingUserId", "dbo.Users");
            DropForeignKey("dbo.DealWatchingUsers", "WatchedDealId", "dbo.Deals");
            DropForeignKey("dbo.Deals", "TrashedUserId", "dbo.Users");
            DropForeignKey("dbo.Deals", "StageId", "dbo.Stages");
            DropForeignKey("dbo.Deals", "SalesProcessId", "dbo.SalesProcesses");
            DropForeignKey("dbo.Deals", "OwnerId", "dbo.Users");
            DropForeignKey("dbo.Deals", "LeadStatusId", "dbo.LeadStatus");
            DropForeignKey("dbo.LeadConversions", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.LeadConversions", "DealId", "dbo.Deals");
            DropForeignKey("dbo.LeadConversions", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.Deals", "LeadConversionApproverId", "dbo.Users");
            DropForeignKey("dbo.Deals", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.DealStageHistories", "UserId", "dbo.Users");
            DropForeignKey("dbo.DealStageHistories", "OldStageId", "dbo.Stages");
            DropForeignKey("dbo.DealStageHistories", "NewStageId", "dbo.Stages");
            DropForeignKey("dbo.Steps", "StageId", "dbo.Stages");
            DropForeignKey("dbo.Steps", "AssetId", "Coaching.Assets");
            DropForeignKey("Coaching.UserShares", "AssetId", "Coaching.Assets");
            DropForeignKey("Coaching.UserRatings", "AssetItemID", "Coaching.Assets");
            DropForeignKey("Coaching.UserFavorites", "FavoritesFolderID", "Coaching.UserFolders");
            DropForeignKey("Coaching.UserFavorites", "AssetItemID", "Coaching.Assets");
            DropForeignKey("Coaching.Assets", "ChannelID", "Coaching.Channels");
            DropForeignKey("Coaching.Assets", "TypeID", "Coaching.AssetTypes");
            DropForeignKey("Coaching.AssetTags", "TagID", "Coaching.Tags");
            DropForeignKey("Coaching.Tags", "BroadcasterId", "Coaching.Broadcasters");
            DropForeignKey("Coaching.ProgramAssets", "ProgramID", "Coaching.Programs");
            DropForeignKey("Coaching.ProgramAssets", "AssetID", "Coaching.Assets");
            DropForeignKey("Coaching.Programs", "ChannelID", "Coaching.Channels");
            DropForeignKey("Coaching.Channels", "BroadcasterID", "Coaching.Broadcasters");
            DropForeignKey("Coaching.AssetTags", "AssetItemID", "Coaching.Assets");
            DropForeignKey("dbo.Sections", "StageId", "dbo.Stages");
            DropForeignKey("dbo.SectionCustomLinks", "SectionId", "dbo.Sections");
            DropForeignKey("dbo.SectionCustomLinks", "CustomLinkId", "dbo.CustomLinksAndButtons");
            DropForeignKey("dbo.CustomLinksAndButtons", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.CustomLinksAndButtons", "CustomLinksUrl_Id", "dbo.CustomLinksUrls");
            DropForeignKey("dbo.CustomLinksAndButtons", "CustomLinksButtonPlacement_Id", "dbo.CustomLinksButtonPlacements");
            DropForeignKey("dbo.Stages", "SalesProcessId", "dbo.SalesProcesses");
            DropForeignKey("dbo.ViewRecords", "UserId", "dbo.Users");
            DropForeignKey("dbo.ViewRecords", "TaskId", "dbo.Tasks");
            DropForeignKey("dbo.ViewRecords", "DealId", "dbo.Deals");
            DropForeignKey("dbo.ViewRecords", "ContactId", "dbo.Contacts");
            DropForeignKey("dbo.ViewRecords", "AccountId", "dbo.Accounts");
            DropForeignKey("dbo.Tasks", "TaskTypeId", "dbo.TaskTypes");
            DropForeignKey("dbo.TaskTypes", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.TaskShares", "Task_Id", "dbo.Tasks");
            DropForeignKey("dbo.TaskContacts", "TaskId", "dbo.Tasks");
            DropForeignKey("dbo.TaskContacts", "ContactId", "dbo.Contacts");
            DropForeignKey("dbo.StandardObjectRelationshipDefintions", "Task_Id", "dbo.Tasks");
            DropForeignKey("dbo.StandardRelationships", "Task_Id", "dbo.Tasks");
            DropForeignKey("dbo.StandardRelationships", "StandardObjectRelationshipDefintion_Id", "dbo.StandardObjectRelationshipDefintions");
            DropForeignKey("dbo.StandardRelationships", "StandardObjectDefinition_Id", "dbo.StandardObjectDefinitions");
            DropForeignKey("dbo.UsageRecords", "UserId", "dbo.Users");
            DropForeignKey("dbo.UsageRecords", "UsageActionId", "dbo.UsageActions");
            DropForeignKey("dbo.UsageRecords", "StandardObjectDefinitionId", "dbo.StandardObjectDefinitions");
            DropForeignKey("dbo.TableHeaders", "StandardObjectDefinition_Id", "dbo.StandardObjectDefinitions");
            DropForeignKey("dbo.StandardRelationships", "Organisation_Id", "dbo.Organisations");
            DropForeignKey("dbo.StandardRelationships", "Deal_Id", "dbo.Deals");
            DropForeignKey("dbo.StandardRelationships", "CustomObjectRow_Id", "dbo.CustomObjectRows");
            DropForeignKey("dbo.StandardRelationships", "CustomObject_Id", "dbo.CustomObjects");
            DropForeignKey("dbo.StandardRelationships", "Contact_Id", "dbo.Contacts");
            DropForeignKey("dbo.StandardRelationships", "Account_Id", "dbo.Accounts");
            DropForeignKey("dbo.StandardObjectRelationshipDefintions", "Organisation_Id", "dbo.Organisations");
            DropForeignKey("dbo.StandardObjectRelationshipDefintions", "Deal_Id", "dbo.Deals");
            DropForeignKey("dbo.StandardObjectRelationshipDefintions", "CustomObject_Id", "dbo.CustomObjects");
            DropForeignKey("dbo.StandardObjectRelationshipDefintions", "Contact_Id", "dbo.Contacts");
            DropForeignKey("dbo.StandardObjectRelationshipDefintions", "Account_Id", "dbo.Accounts");
            DropForeignKey("dbo.Tasks", "StageId", "dbo.Stages");
            DropForeignKey("dbo.Tasks", "SalesProcessId", "dbo.SalesProcesses");
            DropForeignKey("dbo.Tasks", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.Tasks", "DealId", "dbo.Deals");
            DropForeignKey("dbo.Tasks", "CustomObjectRow_Id", "dbo.CustomObjectRows");
            DropForeignKey("dbo.Tasks", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.Tasks", "AccountId", "dbo.Accounts");
            DropForeignKey("dbo.SalesProcesses", "OrganisationId", "dbo.Organisations");
            DropForeignKey("dbo.BuyingProcesses", "Id", "dbo.SalesProcesses");
            DropForeignKey("dbo.BuyingProcessStages", "BuyingProcess_Id", "dbo.BuyingProcesses");
            DropForeignKey("dbo.DealStageHistories", "DealId", "dbo.Deals");
            DropForeignKey("dbo.DealShares", "Deal_Id", "dbo.Deals");
            DropForeignKey("dbo.Deals", "RevenueCurrency", "dbo.Currencies");
            DropForeignKey("dbo.Deals", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.Deals", "LeadContactId", "dbo.Contacts");
            DropForeignKey("dbo.Comments", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.Comments", "DealId", "dbo.Deals");
            DropForeignKey("dbo.Comments", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.Comments", "AccountId", "dbo.Accounts");
            DropForeignKey("dbo.Attachments", "Deal_Id", "dbo.Deals");
            DropForeignKey("dbo.Attachments", "Account_Id", "dbo.Accounts");
            DropForeignKey("dbo.Deals", "AccountId", "dbo.Accounts");
            DropForeignKey("dbo.ItemSteps", "CustomObjectRowId", "dbo.CustomObjectRows");
            DropForeignKey("dbo.ItemSteps", "ContactId", "dbo.Contacts");
            DropForeignKey("dbo.ItemSteps", "AccountId", "dbo.Accounts");
            DropForeignKey("dbo.CustomObjectRowFields", "CustomObjectRow_Id", "dbo.CustomObjectRows");
            DropForeignKey("dbo.CustomObjectRowFields", "Field_Id", "dbo.CustomFields");
            DropForeignKey("dbo.CustomObjectRows", "CustomObject_Id", "dbo.CustomObjects");
            DropForeignKey("dbo.CustomObjectRows", "CreatedBy_Id", "dbo.Users");
            DropForeignKey("dbo.CustomObjectFilters", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.CustomObjectFilterFields", "CustomObjectFilterId", "dbo.CustomObjectFilters");
            DropForeignKey("dbo.CustomObjectFilterFields", "CustomFieldId", "dbo.CustomFields");
            DropForeignKey("dbo.CustomObjectFilters", "CustomObjectId", "dbo.CustomObjects");
            DropForeignKey("dbo.CustomObjectFilters", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.CustomObjects", "CreatedBy_Id", "dbo.Users");
            DropForeignKey("dbo.CustomFieldValues", "CustomFieldId", "dbo.CustomFields");
            DropForeignKey("dbo.CustomFields", "CustomFieldValidation_Id", "dbo.CustomFieldValidations");
            DropForeignKey("dbo.CustomFieldOptions", "CustomFieldId", "dbo.CustomFields");
            DropForeignKey("dbo.CustomFields", "CustomFieldGroupId", "dbo.CustomFieldGroups");
            DropForeignKey("dbo.Organisations", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.ApiKeys", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.ApiKeys", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.ApiAuthentications", "LastModifiedById", "dbo.Users");
            DropForeignKey("dbo.ApiAuthentications", "CreatedById", "dbo.Users");
            DropForeignKey("dbo.AcheivedAwards", "User_Id", "dbo.Users");
            DropForeignKey("dbo.AcheivedAwards", "AwardId", "dbo.Awards");
            DropForeignKey("dbo.ContactShares", "Contact_Id", "dbo.Contacts");
            DropForeignKey("dbo.Contacts", "AccountId", "dbo.Accounts");
            DropForeignKey("dbo.StepDocuments", "AccountId", "dbo.Accounts");
            DropIndex("dbo.AccountWatchingUsers", new[] { "WatchingUserId" });
            DropIndex("dbo.AccountWatchingUsers", new[] { "WatchedAccountId" });
            DropIndex("dbo.GroupUsers", new[] { "User_Id" });
            DropIndex("dbo.GroupUsers", new[] { "Group_Id" });
            DropIndex("dbo.FeatureEditions", new[] { "Feature_Id" });
            DropIndex("dbo.FeatureEditions", new[] { "Edition_Id" });
            DropIndex("dbo.DefaultAddOnInEdition", new[] { "EditionId" });
            DropIndex("dbo.DefaultAddOnInEdition", new[] { "AddOnId" });
            DropIndex("dbo.DealContactRoleDealContacts", new[] { "DealContactRole_Id" });
            DropIndex("dbo.DealContactRoleDealContacts", new[] { "DealContact_Id" });
            DropIndex("dbo.DealWatchingUsers", new[] { "WatchingUserId" });
            DropIndex("dbo.DealWatchingUsers", new[] { "WatchedDealId" });
            DropIndex("IdenServ.ScopeSecrets", new[] { "Scope_Id" });
            DropIndex("IdenServ.ScopeClaims", new[] { "Scope_Id" });
            DropIndex("IdenServ.ClientSecrets", new[] { "Client_Id" });
            DropIndex("IdenServ.ClientScopes", new[] { "Client_Id" });
            DropIndex("IdenServ.ClientRedirectUris", new[] { "Client_Id" });
            DropIndex("IdenServ.ClientPostLogoutRedirectUris", new[] { "Client_Id" });
            DropIndex("IdenServ.ClientIdPRestrictions", new[] { "Client_Id" });
            DropIndex("IdenServ.ClientCustomGrantTypes", new[] { "Client_Id" });
            DropIndex("IdenServ.ClientCorsOrigins", new[] { "Client_Id" });
            DropIndex("IdenServ.ClientClaims", new[] { "Client_Id" });
            DropIndex("Coaching.UserViews", new[] { "CoachingUserId" });
            DropIndex("dbo.ExternalIntegrationFieldMappings", new[] { "ExternalIntegrationTypeMappingId" });
            DropIndex("dbo.ExternalIntegrationTypeMappings", new[] { "ExternalIntegrationId" });
            DropIndex("dbo.ExternalIntegrations", new[] { "ApiConnectorId" });
            DropIndex("dbo.AccountShares", new[] { "Account_Id" });
            DropIndex("dbo.UserTargets", new[] { "User_Id" });
            DropIndex("dbo.RoleClaims", new[] { "ApplicationRoleId" });
            DropIndex("dbo.UserRoles", new[] { "IdentityUser_Id" });
            DropIndex("dbo.UserRoles", new[] { "RoleId" });
            DropIndex("dbo.UserLogins", new[] { "IdentityUser_Id" });
            DropIndex("dbo.UserClaims", new[] { "IdentityUser_Id" });
            DropIndex("dbo.ColumnPreferences", new[] { "TablePreference_Id" });
            DropIndex("dbo.TablePreferences", new[] { "SystemPreferences_Id" });
            DropIndex("dbo.PasswordResetRequests", new[] { "UserId" });
            DropIndex("dbo.OAuth2Token", new[] { "User_Id" });
            DropIndex("dbo.NotificationFields", new[] { "Notification_Id" });
            DropIndex("dbo.Notifications", new[] { "UserId" });
            DropIndex("dbo.LogoImages", new[] { "UserId" });
            DropIndex("dbo.LogoImages", new[] { "ContactId" });
            DropIndex("dbo.LogoImages", new[] { "AccountId" });
            DropIndex("dbo.FeatureClaims", new[] { "FeatureId" });
            DropIndex("dbo.EditionCosts", new[] { "Edition_Id" });
            DropIndex("dbo.AddOnCosts", new[] { "AddOnId" });
            DropIndex("dbo.SubscriptionAddOns", new[] { "AddOnCostId" });
            DropIndex("dbo.SubscriptionAddOns", new[] { "AddOnId" });
            DropIndex("dbo.SubscriptionAddOns", new[] { "SubscriptionId" });
            DropIndex("dbo.AddOnClaimValues", new[] { "AddOnClaimId" });
            DropIndex("dbo.AddOnClaimValues", new[] { "SubscriptionAddOnId" });
            DropIndex("dbo.AddOnClaims", new[] { "AddOnId" });
            DropIndex("dbo.Subscriptions", new[] { "EditionId" });
            DropIndex("dbo.StcOrgs", new[] { "OrganisationId" });
            DropIndex("dbo.StcOrgs", new[] { "SalesTrainingCompanyId" });
            DropIndex("dbo.SalesTrainingCompanies", new[] { "StcTheme_Id" });
            DropIndex("dbo.Statements", new[] { "Rule_Id" });
            DropIndex("dbo.Searches", new[] { "RuleId" });
            DropIndex("dbo.Rules", new[] { "OrganisationId" });
            DropIndex("dbo.Rules", new[] { "LastModifiedById" });
            DropIndex("dbo.Rules", new[] { "CreatedById" });
            DropIndex("dbo.PickListOptions", new[] { "PickListId" });
            DropIndex("dbo.PickLists", new[] { "OrganisationId" });
            DropIndex("dbo.SideNavSideNavItemLookups", new[] { "SideNavItemId" });
            DropIndex("dbo.SideNavSideNavItemLookups", new[] { "SideNavId" });
            DropIndex("dbo.SalesObjectViewArchives", new[] { "OrganisationId" });
            DropIndex("dbo.SalesObjectViewArchiveItems", new[] { "SalesObjectViewId" });
            DropIndex("dbo.SalesObjectViewArchiveItems", new[] { "SalesObjectViewArchiveId" });
            DropIndex("dbo.SalesObjectViews", new[] { "SideNavItemId" });
            DropIndex("dbo.OrganisationSalesObjectViews", new[] { "Organisation_Id" });
            DropIndex("dbo.OrganisationSalesObjectViews", new[] { "SalesObjectViewId" });
            DropIndex("dbo.Invites", new[] { "OrganisationId" });
            DropIndex("dbo.Invites", new[] { "UserId" });
            DropIndex("dbo.PackageItems", new[] { "Package_Id" });
            DropIndex("dbo.IntegrationPackages", new[] { "Organisation_Id" });
            DropIndex("dbo.IntegrationPackages", new[] { "LastModifiedById" });
            DropIndex("dbo.IntegrationPackages", new[] { "CreatedById" });
            DropIndex("dbo.UserEmailNotificationPreferences", new[] { "UserId" });
            DropIndex("dbo.UserEmailNotificationPreferences", new[] { "EmailTemplateConfigurationId" });
            DropIndex("dbo.OrgEmailNotificiationPreferences", new[] { "Organisation_Id" });
            DropIndex("dbo.OrgEmailNotificiationPreferences", new[] { "EmailTemplateConfigurationId" });
            DropIndex("dbo.EmailTemplates", new[] { "EmailTemplateConfiguration_TemplateID" });
            DropIndex("dbo.EmailTemplates", new[] { "OrganisationId" });
            DropIndex("dbo.DealContactRoles", new[] { "OrganisationId" });
            DropIndex("dbo.CustomFieldTypeGroup", new[] { "OrganisationId" });
            DropIndex("dbo.LeadConversions", new[] { "LastModifiedById" });
            DropIndex("dbo.LeadConversions", new[] { "CreatedById" });
            DropIndex("dbo.LeadConversions", new[] { "DealId" });
            DropIndex("Coaching.UserShares", new[] { "AssetId" });
            DropIndex("Coaching.UserRatings", new[] { "AssetItemID" });
            DropIndex("Coaching.UserFavorites", new[] { "FavoritesFolderID" });
            DropIndex("Coaching.UserFavorites", new[] { "AssetItemID" });
            DropIndex("Coaching.ProgramAssets", new[] { "AssetID" });
            DropIndex("Coaching.ProgramAssets", new[] { "ProgramID" });
            DropIndex("Coaching.Programs", new[] { "ChannelID" });
            DropIndex("Coaching.Channels", new[] { "BroadcasterID" });
            DropIndex("Coaching.Tags", new[] { "BroadcasterId" });
            DropIndex("Coaching.AssetTags", new[] { "TagID" });
            DropIndex("Coaching.AssetTags", new[] { "AssetItemID" });
            DropIndex("Coaching.Assets", new[] { "TypeID" });
            DropIndex("Coaching.Assets", new[] { "ChannelID" });
            DropIndex("dbo.Steps", new[] { "AssetId" });
            DropIndex("dbo.Steps", new[] { "StageId" });
            DropIndex("dbo.CustomLinksAndButtons", new[] { "OrganisationId" });
            DropIndex("dbo.CustomLinksAndButtons", new[] { "CustomLinksUrl_Id" });
            DropIndex("dbo.CustomLinksAndButtons", new[] { "CustomLinksButtonPlacement_Id" });
            DropIndex("dbo.SectionCustomLinks", new[] { "CustomLinkId" });
            DropIndex("dbo.SectionCustomLinks", new[] { "SectionId" });
            DropIndex("dbo.Sections", new[] { "StageId" });
            DropIndex("dbo.ViewRecords", new[] { "UserId" });
            DropIndex("dbo.ViewRecords", new[] { "TaskId" });
            DropIndex("dbo.ViewRecords", new[] { "DealId" });
            DropIndex("dbo.ViewRecords", new[] { "ContactId" });
            DropIndex("dbo.ViewRecords", new[] { "AccountId" });
            DropIndex("dbo.TaskTypes", new[] { "OrganisationId" });
            DropIndex("dbo.TaskShares", new[] { "Task_Id" });
            DropIndex("dbo.TaskContacts", new[] { "ContactId" });
            DropIndex("dbo.TaskContacts", new[] { "TaskId" });
            DropIndex("dbo.UsageRecords", new[] { "StandardObjectDefinitionId" });
            DropIndex("dbo.UsageRecords", new[] { "UsageActionId" });
            DropIndex("dbo.UsageRecords", new[] { "UserId" });
            DropIndex("dbo.TableHeaders", new[] { "StandardObjectDefinition_Id" });
            DropIndex("dbo.StandardRelationships", new[] { "CustomObject_Id" });
            DropIndex("dbo.StandardRelationships", new[] { "Account_Id" });
            DropIndex("dbo.StandardRelationships", new[] { "Task_Id" });
            DropIndex("dbo.StandardRelationships", new[] { "Deal_Id" });
            DropIndex("dbo.StandardRelationships", new[] { "StandardObjectRelationshipDefintion_Id" });
            DropIndex("dbo.StandardRelationships", new[] { "CustomObjectRow_Id" });
            DropIndex("dbo.StandardRelationships", new[] { "Contact_Id" });
            DropIndex("dbo.StandardRelationships", new[] { "Organisation_Id" });
            DropIndex("dbo.StandardRelationships", new[] { "StandardObjectDefinition_Id" });
            DropIndex("dbo.StandardObjectRelationshipDefintions", new[] { "Account_Id" });
            DropIndex("dbo.StandardObjectRelationshipDefintions", new[] { "Task_Id" });
            DropIndex("dbo.StandardObjectRelationshipDefintions", new[] { "Deal_Id" });
            DropIndex("dbo.StandardObjectRelationshipDefintions", new[] { "Contact_Id" });
            DropIndex("dbo.StandardObjectRelationshipDefintions", new[] { "Organisation_Id" });
            DropIndex("dbo.StandardObjectRelationshipDefintions", new[] { "CustomObject_Id" });
            DropIndex("dbo.Tasks", new[] { "CustomObjectRow_Id" });
            DropIndex("dbo.Tasks", new[] { "StageId" });
            DropIndex("dbo.Tasks", new[] { "SalesProcessId" });
            DropIndex("dbo.Tasks", new[] { "AccountId" });
            DropIndex("dbo.Tasks", new[] { "LastModifiedById" });
            DropIndex("dbo.Tasks", new[] { "CreatedById" });
            DropIndex("dbo.Tasks", new[] { "TaskTypeId" });
            DropIndex("dbo.Tasks", new[] { "DealId" });
            DropIndex("dbo.BuyingProcessStages", new[] { "BuyingProcess_Id" });
            DropIndex("dbo.BuyingProcesses", new[] { "Id" });
            DropIndex("dbo.SalesProcesses", new[] { "OrganisationId" });
            DropIndex("dbo.Stages", new[] { "SalesProcessId" });
            DropIndex("dbo.DealStageHistories", new[] { "UserId" });
            DropIndex("dbo.DealStageHistories", new[] { "NewStageId" });
            DropIndex("dbo.DealStageHistories", new[] { "OldStageId" });
            DropIndex("dbo.DealStageHistories", new[] { "DealId" });
            DropIndex("dbo.DealShares", new[] { "Deal_Id" });
            DropIndex("dbo.Comments", new[] { "AccountId" });
            DropIndex("dbo.Comments", new[] { "LastModifiedById" });
            DropIndex("dbo.Comments", new[] { "CreatedById" });
            DropIndex("dbo.Comments", new[] { "DealId" });
            DropIndex("dbo.Attachments", new[] { "Account_Id" });
            DropIndex("dbo.Attachments", new[] { "Deal_Id" });
            DropIndex("dbo.Deals", new[] { "LeadStatusId" });
            DropIndex("dbo.Deals", new[] { "LeadContactId" });
            DropIndex("dbo.Deals", new[] { "LeadConversionApproverId" });
            DropIndex("dbo.Deals", new[] { "TrashedUserId" });
            DropIndex("dbo.Deals", new[] { "LastModifiedById" });
            DropIndex("dbo.Deals", new[] { "CreatedById" });
            DropIndex("dbo.Deals", new[] { "SalesProcessId" });
            DropIndex("dbo.Deals", new[] { "AccountId" });
            DropIndex("dbo.Deals", new[] { "StageId" });
            DropIndex("dbo.Deals", new[] { "RevenueCurrency" });
            DropIndex("dbo.Deals", new[] { "OwnerId" });
            DropIndex("dbo.DealSteps", new[] { "ReminderTaskId" });
            DropIndex("dbo.DealSteps", new[] { "StepId" });
            DropIndex("dbo.DealSteps", new[] { "DealId" });
            DropIndex("dbo.ReminderTasks", new[] { "TaskId" });
            DropIndex("dbo.ItemSteps", new[] { "AccountId" });
            DropIndex("dbo.ItemSteps", new[] { "ContactId" });
            DropIndex("dbo.ItemSteps", new[] { "TaskId" });
            DropIndex("dbo.ItemSteps", new[] { "CustomObjectRowId" });
            DropIndex("dbo.ItemSteps", new[] { "ReminderTaskId" });
            DropIndex("dbo.ItemSteps", new[] { "StepId" });
            DropIndex("dbo.CustomObjectRowFields", new[] { "CustomObjectRow_Id" });
            DropIndex("dbo.CustomObjectRowFields", new[] { "Field_Id" });
            DropIndex("dbo.CustomObjectRows", new[] { "StageId" });
            DropIndex("dbo.CustomObjectRows", new[] { "SalesProcessId" });
            DropIndex("dbo.CustomObjectRows", new[] { "OwnerId" });
            DropIndex("dbo.CustomObjectRows", new[] { "CustomObject_Id" });
            DropIndex("dbo.CustomObjectRows", new[] { "Organisation_Id" });
            DropIndex("dbo.CustomObjectRows", new[] { "LastModifiedBy_Id" });
            DropIndex("dbo.CustomObjectRows", new[] { "CreatedBy_Id" });
            DropIndex("dbo.CustomObjectFilterFields", new[] { "CustomFieldId" });
            DropIndex("dbo.CustomObjectFilterFields", new[] { "CustomObjectFilterId" });
            DropIndex("dbo.CustomObjectFilters", new[] { "LastModifiedById" });
            DropIndex("dbo.CustomObjectFilters", new[] { "CreatedById" });
            DropIndex("dbo.CustomObjectFilters", new[] { "CustomObjectId" });
            DropIndex("dbo.CustomObjects", new[] { "Organisation_Id" });
            DropIndex("dbo.CustomObjects", new[] { "LastModifiedBy_Id" });
            DropIndex("dbo.CustomObjects", new[] { "CreatedBy_Id" });
            DropIndex("dbo.CustomFieldValues", new[] { "CustomFieldId" });
            DropIndex("dbo.CustomFieldOptions", new[] { "CustomFieldId" });
            DropIndex("dbo.CustomFields", new[] { "CustomFieldValidation_Id" });
            DropIndex("dbo.CustomFields", new[] { "CustomFieldGroupId" });
            DropIndex("dbo.CustomFields", new[] { "CustomObject_Id" });
            DropIndex("dbo.CustomFields", new[] { "CustomObjectRow_Id" });
            DropIndex("dbo.CustomFields", new[] { "OrganisationId" });
            DropIndex("dbo.CustomFieldGroups", new[] { "OrganisationId" });
            DropIndex("dbo.Organisations", new[] { "IsStc_Id" });
            DropIndex("dbo.Organisations", new[] { "OrganisationTheme_Id" });
            DropIndex("dbo.Organisations", new[] { "LastModifiedById" });
            DropIndex("dbo.Organisations", new[] { "CreatedById" });
            DropIndex("dbo.Organisations", new[] { "Subscription_Id" });
            DropIndex("dbo.ApiKeys", new[] { "OrganisationId" });
            DropIndex("dbo.ApiKeys", new[] { "LastModifiedById" });
            DropIndex("dbo.ApiKeys", new[] { "CreatedById" });
            DropIndex("dbo.ApiAuthentications", new[] { "LastModifiedById" });
            DropIndex("dbo.ApiAuthentications", new[] { "CreatedById" });
            DropIndex("dbo.AcheivedAwards", new[] { "User_Id" });
            DropIndex("dbo.AcheivedAwards", new[] { "AwardId" });
            DropIndex("dbo.Users", new[] { "ManagerId" });
            DropIndex("dbo.Users", new[] { "LogoImage_Id" });
            DropIndex("dbo.Users", new[] { "SystemPreferences_Id" });
            DropIndex("dbo.Users", new[] { "Organisation_Id" });
            DropIndex("dbo.Users", new[] { "Task_Id" });
            DropIndex("dbo.Users", new[] { "UserProfileId" });
            DropIndex("dbo.ContactShares", new[] { "Contact_Id" });
            DropIndex("dbo.Contacts", new[] { "StageId" });
            DropIndex("dbo.Contacts", new[] { "SalesProcessId" });
            DropIndex("dbo.Contacts", new[] { "LogoImage_Id" });
            DropIndex("dbo.Contacts", new[] { "AccountId" });
            DropIndex("dbo.Contacts", new[] { "LastModifiedById" });
            DropIndex("dbo.Contacts", new[] { "CreatedById" });
            DropIndex("dbo.Contacts", new[] { "OrganisationId" });
            DropIndex("dbo.StepDocuments", new[] { "Contact_Id" });
            DropIndex("dbo.StepDocuments", new[] { "TaskId" });
            DropIndex("dbo.StepDocuments", new[] { "PartnerId" });
            DropIndex("dbo.StepDocuments", new[] { "AccountId" });
            DropIndex("dbo.StepDocuments", new[] { "LeadId" });
            DropIndex("dbo.StepDocuments", new[] { "CustomTableRowId" });
            DropIndex("dbo.StepDocuments", new[] { "StepId" });
            DropIndex("dbo.StepDocuments", new[] { "DealId" });
            DropIndex("dbo.Accounts", new[] { "StageId" });
            DropIndex("dbo.Accounts", new[] { "SalesProcessId" });
            DropIndex("dbo.Accounts", new[] { "LogoImage_Id" });
            DropIndex("dbo.Accounts", new[] { "LastModifiedById" });
            DropIndex("dbo.Accounts", new[] { "CreatedById" });
            DropIndex("dbo.Accounts", new[] { "OwnerId" });
            DropTable("dbo.AccountWatchingUsers");
            DropTable("dbo.GroupUsers");
            DropTable("dbo.FeatureEditions");
            DropTable("dbo.DefaultAddOnInEdition");
            DropTable("dbo.DealContactRoleDealContacts");
            DropTable("dbo.DealWatchingUsers");
            DropTable("dbo.WatchNotificationEmails");
            DropTable("dbo.UsageLevels");
            DropTable("dbo.tempNotifications");
            DropTable("dbo.tempNotificationFields");
            DropTable("dbo.StepActionFiles");
            DropTable("dbo.MeetingVisualiserChartItems");
            DropTable("dbo.MaintenanceSchedules");
            DropTable("dbo.Localizations");
            DropTable("dbo.ImportedDatas");
            DropTable("IdenServ.Tokens");
            DropTable("IdenServ.ScopeSecrets");
            DropTable("IdenServ.Scopes");
            DropTable("IdenServ.ScopeClaims");
            DropTable("IdenServ.Consents");
            DropTable("IdenServ.ClientSecrets");
            DropTable("IdenServ.ClientScopes");
            DropTable("IdenServ.ClientRedirectUris");
            DropTable("IdenServ.ClientPostLogoutRedirectUris");
            DropTable("IdenServ.ClientIdPRestrictions");
            DropTable("IdenServ.ClientCustomGrantTypes");
            DropTable("IdenServ.ClientCorsOrigins");
            DropTable("IdenServ.Clients");
            DropTable("IdenServ.ClientClaims");
            DropTable("dbo.ExchangeRates");
            DropTable("dbo.EmailNotifications");
            DropTable("dbo.EmailConfiguration");
            DropTable("dbo.DefaultAddOnInEditions");
            DropTable("dbo.DealOrgCharts");
            DropTable("dbo.CustomLinksApiTypes");
            DropTable("dbo.CurrencyAmounts");
            DropTable("dbo.CountryLists");
            DropTable("Coaching.Themes");
            DropTable("Coaching.StaThemes");
            DropTable("Coaching.UserViews");
            DropTable("Coaching.CoachingUser");
            DropTable("Coaching.Admin_EventLog");
            DropTable("Coaching.Admin_ConnectorLog");
            DropTable("dbo.ApiTypeImportQueueItems");
            DropTable("dbo.ExternalIntegrationFieldMappings");
            DropTable("dbo.ExternalIntegrationTypeMappings");
            DropTable("dbo.ExternalIntegrations");
            DropTable("dbo.ApiConnectors");
            DropTable("dbo.AccountShares");
            DropTable("dbo.UserTargets");
            DropTable("dbo.RoleClaims");
            DropTable("dbo.Roles");
            DropTable("dbo.UserRoles");
            DropTable("dbo.UserProfiles");
            DropTable("dbo.UserLogins");
            DropTable("dbo.UserClaims");
            DropTable("dbo.ColumnPreferences");
            DropTable("dbo.TablePreferences");
            DropTable("dbo.SystemPreferences");
            DropTable("dbo.PasswordResetRequests");
            DropTable("dbo.OAuth2Token");
            DropTable("dbo.NotificationFields");
            DropTable("dbo.Notifications");
            DropTable("dbo.LogoImages");
            DropTable("dbo.Groups");
            DropTable("dbo.FeatureClaims");
            DropTable("dbo.Features");
            DropTable("dbo.EditionCosts");
            DropTable("dbo.AddOnCosts");
            DropTable("dbo.SubscriptionAddOns");
            DropTable("dbo.AddOnClaimValues");
            DropTable("dbo.AddOnClaims");
            DropTable("dbo.AddOns");
            DropTable("dbo.Editions");
            DropTable("dbo.Subscriptions");
            DropTable("dbo.StcThemes");
            DropTable("dbo.StcOrgs");
            DropTable("dbo.SalesTrainingCompanies");
            DropTable("dbo.Statements");
            DropTable("dbo.Searches");
            DropTable("dbo.Rules");
            DropTable("dbo.PickListOptions");
            DropTable("dbo.PickLists");
            DropTable("dbo.SideNavs");
            DropTable("dbo.SideNavSideNavItemLookups");
            DropTable("dbo.SideNavItems");
            DropTable("dbo.SalesObjectViewArchives");
            DropTable("dbo.SalesObjectViewArchiveItems");
            DropTable("dbo.SalesObjectViews");
            DropTable("dbo.OrganisationSalesObjectViews");
            DropTable("dbo.Invites");
            DropTable("dbo.PackageItems");
            DropTable("dbo.IntegrationPackages");
            DropTable("dbo.UserEmailNotificationPreferences");
            DropTable("dbo.OrgEmailNotificiationPreferences");
            DropTable("dbo.EmailTemplateConfiguration");
            DropTable("dbo.EmailTemplates");
            DropTable("dbo.DealContacts");
            DropTable("dbo.DealContactRoles");
            DropTable("dbo.CustomFieldTypeGroup");
            DropTable("dbo.LeadStatus");
            DropTable("dbo.LeadConversions");
            DropTable("Coaching.UserShares");
            DropTable("Coaching.UserRatings");
            DropTable("Coaching.UserFolders");
            DropTable("Coaching.UserFavorites");
            DropTable("Coaching.AssetTypes");
            DropTable("Coaching.ProgramAssets");
            DropTable("Coaching.Programs");
            DropTable("Coaching.Channels");
            DropTable("Coaching.Broadcasters");
            DropTable("Coaching.Tags");
            DropTable("Coaching.AssetTags");
            DropTable("Coaching.Assets");
            DropTable("dbo.Steps");
            DropTable("dbo.CustomLinksUrls");
            DropTable("dbo.CustomLinksButtonPlacements");
            DropTable("dbo.CustomLinksAndButtons");
            DropTable("dbo.SectionCustomLinks");
            DropTable("dbo.Sections");
            DropTable("dbo.ViewRecords");
            DropTable("dbo.TaskTypes");
            DropTable("dbo.TaskShares");
            DropTable("dbo.TaskContacts");
            DropTable("dbo.UsageActions");
            DropTable("dbo.UsageRecords");
            DropTable("dbo.TableHeaders");
            DropTable("dbo.StandardObjectDefinitions");
            DropTable("dbo.StandardRelationships");
            DropTable("dbo.StandardObjectRelationshipDefintions");
            DropTable("dbo.Tasks");
            DropTable("dbo.BuyingProcessStages");
            DropTable("dbo.BuyingProcesses");
            DropTable("dbo.SalesProcesses");
            DropTable("dbo.Stages");
            DropTable("dbo.DealStageHistories");
            DropTable("dbo.DealShares");
            DropTable("dbo.Currencies");
            DropTable("dbo.Comments");
            DropTable("dbo.Attachments");
            DropTable("dbo.Deals");
            DropTable("dbo.DealSteps");
            DropTable("dbo.ReminderTasks");
            DropTable("dbo.ItemSteps");
            DropTable("dbo.CustomObjectRowFields");
            DropTable("dbo.CustomObjectRows");
            DropTable("dbo.CustomObjectFilterFields");
            DropTable("dbo.CustomObjectFilters");
            DropTable("dbo.CustomObjects");
            DropTable("dbo.CustomFieldValues");
            DropTable("dbo.CustomFieldValidations");
            DropTable("dbo.CustomFieldOptions");
            DropTable("dbo.CustomFields");
            DropTable("dbo.CustomFieldGroups");
            DropTable("dbo.Organisations");
            DropTable("dbo.ApiKeys");
            DropTable("dbo.ApiAuthentications");
            DropTable("dbo.Awards");
            DropTable("dbo.AcheivedAwards");
            DropTable("dbo.Users");
            DropTable("dbo.ContactShares");
            DropTable("dbo.Contacts");
            DropTable("dbo.StepDocuments");
            DropTable("dbo.Accounts");
        }
    }
}

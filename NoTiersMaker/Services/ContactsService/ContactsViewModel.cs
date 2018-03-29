using System;

namespace CustomLogic.Services.ContactsService
{
    public class ContactsViewModel
    {

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Skype { get; set; }
        public int OrganisationId { get; set; }
        public string JobTitle { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateLastModeified { get; set; }
        public string CreatedById { get; set; }
        public string LastModifiedById { get; set; }
        public int? AccountId { get; set; }
        public int? LogoImage_Id { get; set; }
        public string ExternalId { get; set; }
        public int? SalesProcessId { get; set; }
        public int? StageId { get; set; }
        public string Notes { get; set; }
        public string OfficePhone { get; set; }
        public string MobilePhone { get; set; }
        public string OtherPhone { get; set; }

    }
}
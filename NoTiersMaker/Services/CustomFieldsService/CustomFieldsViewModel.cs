﻿using System;

namespace CustomLogic.Services.CustomFieldsService
{
    public class CustomFieldsViewModel
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public int FieldType { get; set; }
        public string ValdiationRegex { get; set; }
        public int OrganisationId { get; set; }
        public int EntityType { get; set; }
        public string IconClass { get; set; }
        public string Color { get; set; }
        public long? CustomObjectRow_Id { get; set; }
        public long? CustomObject_Id { get; set; }
        public bool IsNotVisible { get; set; }
        public int? CustomFieldGroupId { get; set; }
        public int DisplayOrder { get; set; }
        public int? CustomFieldValidation_Id { get; set; }
        public bool Required { get; set; }
        public int? Min { get; set; }
        public int? Max { get; set; }
        public DateTime? MinDate { get; set; }
        public DateTime? MaxDate { get; set; }

    }
}
using System.Linq;
using CustomLogic.LegacyDatabase;
using CustomLogic.Services.CustomFieldsService;

namespace CustomLogic.Services.CustomFieldValuesService
{
    public static class CustomFieldValuesMapper
    {


        public static CustomFieldValue MapInsertModelToDbModel(CustomFieldValuesViewModel model, CustomFieldValue newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new CustomFieldValue();
            }

            newDomainModel.CustomFieldId = model.CustomFieldId;
            newDomainModel.EntityId = model.EntityId;
            newDomainModel.Value = model.Value;

            return newDomainModel;
        }



        public static CustomFieldValuesViewModel MapDbModelToViewModel(CustomFieldValue dbModel)
        {
            var viewModel = new CustomFieldValuesViewModel();
            viewModel.CustomFieldId = dbModel.CustomFieldId;
            viewModel.EntityId = dbModel.EntityId;
            viewModel.Value = dbModel.Value;
            return viewModel;
        }

        public static IQueryable<CustomFieldValuesViewModel> MapDbModelQueryToViewModelQuery(IQueryable<CustomFieldValue> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c => c.CustomFieldId).Select(c => new CustomFieldValuesViewModel()
            {
                CustomFieldId = c.CustomFieldId,
                EntityId = c.EntityId,
                Value = c.Value,
                CustomFieldsViewModel = new CustomFieldsViewModel
                {
                    Id = c.CustomField.Id,
                    Name = c.CustomField.Name,
                    FieldType = c.CustomField.FieldType,
                    ValdiationRegex = c.CustomField.ValdiationRegex,
                    OrganisationId = c.CustomField.OrganisationId,
                    EntityType = c.CustomField.EntityType,
                    IconClass = c.CustomField.IconClass,
                    Color = c.CustomField.Color,
                    CustomObjectRow_Id = c.CustomField.CustomObjectRowId,
                    CustomObject_Id = c.CustomField.CustomObjectId,
                    IsNotVisible = c.CustomField.IsNotVisible,
                    CustomFieldGroupId = c.CustomField.CustomFieldGroupId,
                    DisplayOrder = c.CustomField.DisplayOrder,
                    CustomFieldValidation_Id = c.CustomField.CustomFieldValidationId,
                    Required = c.CustomField.Required,
                    Min = c.CustomField.Min,
                    Max = c.CustomField.Max,
                    MinDate = c.CustomField.MinDate,
                    MaxDate = c.CustomField.MaxDate,
                }
            });
        }




    }

}
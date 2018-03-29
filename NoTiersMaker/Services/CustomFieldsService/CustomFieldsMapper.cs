using System.Linq;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldsService
{
    public static class CustomFieldsMapper
    {


        public static CustomField MapInsertModelToDbModel(CustomFieldsViewModel model, CustomField newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new CustomField();
            }

            newDomainModel.Id = model.Id;
            newDomainModel.Name = model.Name;
            newDomainModel.FieldType = model.FieldType;
            newDomainModel.ValdiationRegex = model.ValdiationRegex;
            newDomainModel.OrganisationId = model.OrganisationId;
            newDomainModel.EntityType = model.EntityType;
            newDomainModel.IconClass = model.IconClass;
            newDomainModel.Color = model.Color;
            newDomainModel.CustomObjectRowId = model.CustomObjectRow_Id;
            newDomainModel.CustomObjectId = model.CustomObject_Id;
            newDomainModel.IsNotVisible = model.IsNotVisible;
            newDomainModel.CustomFieldGroupId = model.CustomFieldGroupId;
            newDomainModel.DisplayOrder = model.DisplayOrder;
            newDomainModel.CustomFieldValidationId = model.CustomFieldValidation_Id;
            newDomainModel.Required = model.Required;
            newDomainModel.Min = model.Min;
            newDomainModel.Max = model.Max;
            newDomainModel.MinDate = model.MinDate;
            newDomainModel.MaxDate = model.MaxDate;

            return newDomainModel;
        }



        public static CustomFieldsViewModel MapDbModelToViewModel(CustomField dbModel)
        {
            var viewModel = new CustomFieldsViewModel();
            viewModel.Id = dbModel.Id;
            viewModel.Name = dbModel.Name;
            viewModel.FieldType = dbModel.FieldType;
            viewModel.ValdiationRegex = dbModel.ValdiationRegex;
            viewModel.OrganisationId = dbModel.OrganisationId;
            viewModel.EntityType = dbModel.EntityType;
            viewModel.IconClass = dbModel.IconClass;
            viewModel.Color = dbModel.Color;
            viewModel.CustomObjectRow_Id = dbModel.CustomObjectRowId;
            viewModel.CustomObject_Id = dbModel.CustomObjectId;
            viewModel.IsNotVisible = dbModel.IsNotVisible;
            viewModel.CustomFieldGroupId = dbModel.CustomFieldGroupId;
            viewModel.DisplayOrder = dbModel.DisplayOrder;
            viewModel.CustomFieldValidation_Id = dbModel.CustomFieldValidationId;
            viewModel.Required = dbModel.Required;
            viewModel.Min = dbModel.Min;
            viewModel.Max = dbModel.Max;
            viewModel.MinDate = dbModel.MinDate;
            viewModel.MaxDate = dbModel.MaxDate;
            return viewModel;
        }

        public static IQueryable<CustomFieldsViewModel> MapDbModelQueryToViewModelQuery(IQueryable<CustomField> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c => c.Id).Select(c => new CustomFieldsViewModel()
            {
                Id = c.Id,
                Name = c.Name,
                FieldType = c.FieldType,
                ValdiationRegex = c.ValdiationRegex,
                OrganisationId = c.OrganisationId,
                EntityType = c.EntityType,
                IconClass = c.IconClass,
                Color = c.Color,
                CustomObjectRow_Id = c.CustomObjectRowId,
                CustomObject_Id = c.CustomObjectId,
                IsNotVisible = c.IsNotVisible,
                CustomFieldGroupId = c.CustomFieldGroupId,
                DisplayOrder = c.DisplayOrder,
                CustomFieldValidation_Id = c.CustomFieldValidationId,
                Required = c.Required,
                Min = c.Min,
                Max = c.Max,
                MinDate = c.MinDate,
                MaxDate = c.MaxDate,
            });
        }




    }
}

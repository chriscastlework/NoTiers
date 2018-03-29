using System.Linq;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomObjectRowFieldsService
{
    public static class CustomObjectRowFieldsMapper
    {


        public static CustomObjectRowField MapInsertModelToDbModel(CustomObjectRowFieldsViewModel model, CustomObjectRowField newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new CustomObjectRowField();
            }

            newDomainModel.Id = model.Id;
            newDomainModel.Value = model.Value;
            newDomainModel.FieldId = model.Field_Id;
            newDomainModel.CustomObjectRowId = model.CustomObjectRow_Id;
            return newDomainModel;
        }



        public static CustomObjectRowFieldsViewModel MapDbModelToViewModel(CustomObjectRowField dbModel)
        {
            var viewModel = new CustomObjectRowFieldsViewModel();
            viewModel.Id = dbModel.Id;
            viewModel.Value = dbModel.Value;
            viewModel.Field_Id = dbModel.FieldId;
            viewModel.CustomObjectRow_Id = dbModel.CustomObjectRowId;
            viewModel.CustomObjectType = dbModel.CustomObjectRow.CustomObject.Name;
            viewModel.CustomRowName = dbModel.CustomObjectRow.Name;
            return viewModel;
        }

        public static IQueryable<CustomObjectRowFieldsViewModel> MapDbModelQueryToViewModelQuery(IQueryable<CustomObjectRowField> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c => c.Id).Select(c => new CustomObjectRowFieldsViewModel
            {
                Id = c.Id,
                Value = c.Value,
                Field_Id = c.FieldId,
                CustomObjectRow_Id = c.CustomObjectRowId,
                CustomObjectType = c.CustomObjectRow.CustomObject.Name,
                CustomRowName = c.CustomObjectRow.Name
        });
        }




    }

}


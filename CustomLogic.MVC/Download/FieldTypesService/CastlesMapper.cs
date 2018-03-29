using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.FieldTypesService
{
 public static class FieldTypesMapper
    {


        public static FieldType MapInsertModelToDbModel(FieldTypesViewModel model, FieldType newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new FieldType();
            }

newDomainModel.ID = model.ID;
newDomainModel.Name = model.Name;

            return newDomainModel;
        }



        public static FieldTypesViewModel MapDbModelToViewModel(FieldType dbModel)
        {
            var viewModel = new  FieldTypesViewModel();
viewModel.ID = dbModel.ID;
viewModel.Name = dbModel.Name;
            return viewModel;
        }

        public static IQueryable<FieldTypesViewModel> MapDbModelQueryToViewModelQuery(IQueryable<FieldType> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new FieldTypesViewModel()
                                             {
                                                 ID = c.ID,
Name = c.Name,
                                             });
        }




}
}


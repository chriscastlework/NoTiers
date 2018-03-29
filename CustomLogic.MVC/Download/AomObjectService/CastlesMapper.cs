using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.AomObjectService
{
 public static class AomObjectMapper
    {


        public static AomObject MapInsertModelToDbModel(AomObjectViewModel model, AomObject newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new AomObject();
            }

newDomainModel.ID = model.ID;
newDomainModel.AomMetaId = model.AomMetaId;
newDomainModel.Name = model.Name;

            return newDomainModel;
        }



        public static AomObjectViewModel MapDbModelToViewModel(AomObject dbModel)
        {
            var viewModel = new  AomObjectViewModel();
viewModel.ID = dbModel.ID;
viewModel.AomMetaId = dbModel.AomMetaId;
viewModel.Name = dbModel.Name;
            return viewModel;
        }

        public static IQueryable<AomObjectViewModel> MapDbModelQueryToViewModelQuery(IQueryable<AomObject> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new AomObjectViewModel()
                                             {
                                                 ID = c.ID,
AomMetaId = c.AomMetaId,
Name = c.Name,
                                             });
        }




}
}


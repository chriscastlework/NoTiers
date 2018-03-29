using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.AomMetaService
{
 public static class AomMetaMapper
    {


        public static AomMeta MapInsertModelToDbModel(AomMetaViewModel model, AomMeta newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new AomMeta();
            }

newDomainModel.ID = model.ID;
newDomainModel.Name = model.Name;
newDomainModel.Display = model.Display;

            return newDomainModel;
        }



        public static AomMetaViewModel MapDbModelToViewModel(AomMeta dbModel)
        {
            var viewModel = new  AomMetaViewModel();
viewModel.ID = dbModel.ID;
viewModel.Name = dbModel.Name;
viewModel.Display = dbModel.Display;
            return viewModel;
        }

        public static IQueryable<AomMetaViewModel> MapDbModelQueryToViewModelQuery(IQueryable<AomMeta> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new AomMetaViewModel()
                                             {
                                                 ID = c.ID,
Name = c.Name,
Display = c.Display,
                                             });
        }




}
}


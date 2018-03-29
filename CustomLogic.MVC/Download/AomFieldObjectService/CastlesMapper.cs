using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.AomFieldObjectService
{
 public static class AomFieldObjectMapper
    {


        public static AomFieldObject MapInsertModelToDbModel(AomFieldObjectViewModel model, AomFieldObject newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new AomFieldObject();
            }

newDomainModel.ID = model.ID;
newDomainModel.AomObjectId = model.AomObjectId;
newDomainModel.AomFieldMetaId = model.AomFieldMetaId;
newDomainModel.Value = model.Value;

            return newDomainModel;
        }



        public static AomFieldObjectViewModel MapDbModelToViewModel(AomFieldObject dbModel)
        {
            var viewModel = new  AomFieldObjectViewModel();
viewModel.ID = dbModel.ID;
viewModel.AomObjectId = dbModel.AomObjectId;
viewModel.AomFieldMetaId = dbModel.AomFieldMetaId;
viewModel.Value = dbModel.Value;
            return viewModel;
        }

        public static IQueryable<AomFieldObjectViewModel> MapDbModelQueryToViewModelQuery(IQueryable<AomFieldObject> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new AomFieldObjectViewModel()
                                             {
                                                 ID = c.ID,
AomObjectId = c.AomObjectId,
AomFieldMetaId = c.AomFieldMetaId,
Value = c.Value,
                                             });
        }




}
}


using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.AomFieldMetaService
{
 public static class AomFieldMetaMapper
    {


        public static AomFieldMeta MapInsertModelToDbModel(AomFieldMetaViewModel model, AomFieldMeta newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new AomFieldMeta();
            }

newDomainModel.ID = model.ID;
newDomainModel.AomMetaId = model.AomMetaId;
newDomainModel.Name = model.Name;
newDomainModel.FieldTypeId = model.FieldTypeId;
newDomainModel.Display = model.Display;

            return newDomainModel;
        }



        public static AomFieldMetaViewModel MapDbModelToViewModel(AomFieldMeta dbModel)
        {
            var viewModel = new  AomFieldMetaViewModel();
viewModel.ID = dbModel.ID;
viewModel.AomMetaId = dbModel.AomMetaId;
viewModel.Name = dbModel.Name;
viewModel.FieldTypeId = dbModel.FieldTypeId;
viewModel.Display = dbModel.Display;
            return viewModel;
        }

        public static IQueryable<AomFieldMetaViewModel> MapDbModelQueryToViewModelQuery(IQueryable<AomFieldMeta> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new AomFieldMetaViewModel()
                                             {
                                                 ID = c.ID,
AomMetaId = c.AomMetaId,
Name = c.Name,
FieldTypeId = c.FieldTypeId,
Display = c.Display,
                                             });
        }




}
}


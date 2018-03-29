using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipMetaService
{
 public static class RelationshipMetaMapper
    {


        public static RelationshipMeta MapInsertModelToDbModel(RelationshipMetaViewModel model, RelationshipMeta newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new RelationshipMeta();
            }

newDomainModel.ID = model.ID;
newDomainModel.PkAomMetaId = model.PkAomMetaId;
newDomainModel.FkAomMetaId = model.FkAomMetaId;
newDomainModel.FkAomFieldMetaId = model.FkAomFieldMetaId;
newDomainModel.Name = model.Name;
newDomainModel.PkAomFieldMetaId = model.PkAomFieldMetaId;

            return newDomainModel;
        }



        public static RelationshipMetaViewModel MapDbModelToViewModel(RelationshipMeta dbModel)
        {
            var viewModel = new  RelationshipMetaViewModel();
viewModel.ID = dbModel.ID;
viewModel.PkAomMetaId = dbModel.PkAomMetaId;
viewModel.FkAomMetaId = dbModel.FkAomMetaId;
viewModel.FkAomFieldMetaId = dbModel.FkAomFieldMetaId;
viewModel.Name = dbModel.Name;
viewModel.PkAomFieldMetaId = dbModel.PkAomFieldMetaId;
            return viewModel;
        }

        public static IQueryable<RelationshipMetaViewModel> MapDbModelQueryToViewModelQuery(IQueryable<RelationshipMeta> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new RelationshipMetaViewModel()
                                             {
                                                 ID = c.ID,
PkAomMetaId = c.PkAomMetaId,
FkAomMetaId = c.FkAomMetaId,
FkAomFieldMetaId = c.FkAomFieldMetaId,
Name = c.Name,
PkAomFieldMetaId = c.PkAomFieldMetaId,
                                             });
        }




}
}


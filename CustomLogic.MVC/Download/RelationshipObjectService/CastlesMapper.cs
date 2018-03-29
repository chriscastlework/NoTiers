using System.Linq;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipObjectService
{
 public static class RelationshipObjectMapper
    {


        public static RelationshipObject MapInsertModelToDbModel(RelationshipObjectViewModel model, RelationshipObject newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new RelationshipObject();
            }

newDomainModel.ID = model.ID;
newDomainModel.RelationshipMetaId = model.RelationshipMetaId;
newDomainModel.PkAomFieldObjectId = model.PkAomFieldObjectId;
newDomainModel.FkAomFieldObjectId = model.FkAomFieldObjectId;

            return newDomainModel;
        }



        public static RelationshipObjectViewModel MapDbModelToViewModel(RelationshipObject dbModel)
        {
            var viewModel = new  RelationshipObjectViewModel();
viewModel.ID = dbModel.ID;
viewModel.RelationshipMetaId = dbModel.RelationshipMetaId;
viewModel.PkAomFieldObjectId = dbModel.PkAomFieldObjectId;
viewModel.FkAomFieldObjectId = dbModel.FkAomFieldObjectId;
            return viewModel;
        }

        public static IQueryable<RelationshipObjectViewModel> MapDbModelQueryToViewModelQuery(IQueryable<RelationshipObject> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new RelationshipObjectViewModel()
                                             {
                                                 ID = c.ID,
RelationshipMetaId = c.RelationshipMetaId,
PkAomFieldObjectId = c.PkAomFieldObjectId,
FkAomFieldObjectId = c.FkAomFieldObjectId,
                                             });
        }




}
}


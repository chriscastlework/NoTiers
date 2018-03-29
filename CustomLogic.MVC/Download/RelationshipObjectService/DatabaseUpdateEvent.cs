 using System.Data.Entity.Migrations;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.RelationshipObjectService
{
 public class Update : IUpdateEvent<RelationshipObjectViewModel,RelationshipObject>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(RelationshipObjectViewModel model, ref IQueryable<RelationshipObject> repository, IUnitOfWork unitOfWork, Response<RelationshipObjectViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = RelationshipObjectMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<RelationshipObject>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = RelationshipObjectMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

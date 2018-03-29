 using System.Data.Entity.Migrations;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.AomFieldObjectService
{
 public class Update : IUpdateEvent<AomFieldObjectViewModel,AomFieldObject>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(AomFieldObjectViewModel model, ref IQueryable<AomFieldObject> repository, IUnitOfWork unitOfWork, Response<AomFieldObjectViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = AomFieldObjectMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<AomFieldObject>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = AomFieldObjectMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

 using System.Data.Entity.Migrations;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.AomObjectService
{
 public class Update : IUpdateEvent<AomObjectViewModel,AomObject>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(AomObjectViewModel model, ref IQueryable<AomObject> repository, IUnitOfWork unitOfWork, Response<AomObjectViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = AomObjectMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<AomObject>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = AomObjectMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

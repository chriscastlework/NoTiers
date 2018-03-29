 using System.Data.Entity.Migrations;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.AomMetaService
{
 public class Update : IUpdateEvent<AomMetaViewModel,AomMeta>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(AomMetaViewModel model, ref IQueryable<AomMeta> repository, IUnitOfWork unitOfWork, Response<AomMetaViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = AomMetaMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<AomMeta>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = AomMetaMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

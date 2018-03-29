 using System.Data.Entity.Migrations;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.AomFieldMetaService
{
 public class Update : IUpdateEvent<AomFieldMetaViewModel,AomFieldMeta>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(AomFieldMetaViewModel model, ref IQueryable<AomFieldMeta> repository, IUnitOfWork unitOfWork, Response<AomFieldMetaViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = AomFieldMetaMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<AomFieldMeta>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = AomFieldMetaMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

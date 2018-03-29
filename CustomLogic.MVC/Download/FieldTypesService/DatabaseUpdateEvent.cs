 using System.Data.Entity.Migrations;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.FieldTypesService
{
 public class Update : IUpdateEvent<FieldTypesViewModel,FieldType>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(FieldTypesViewModel model, ref IQueryable<FieldType> repository, IUnitOfWork unitOfWork, Response<FieldTypesViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = FieldTypesMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<FieldType>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = FieldTypesMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

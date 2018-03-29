 using System.Data.Entity.Migrations;
 using CustomLogic.Core.Interfaces;
 using CustomLogic.Core.Interfaces.DL;
 using CustomLogic.Core.Models;
using CustomLogic.Database;
 using System.Linq;

namespace CustomLogic.Services.MigrationHistoryService
{
 public class Update : IUpdateEvent<MigrationHistoryViewModel,MigrationHistory>
    {

        public int priority()
        {
            return 0;
        }

        public bool Run(MigrationHistoryViewModel model, ref IQueryable<MigrationHistory> repository, IUnitOfWork unitOfWork, Response<MigrationHistoryViewModel> result, ICoreUser user)
        {
            var dbModel =  repository.Single(c=>c.Id == model.Id); // you need to be using the primary key could be composit
            var updatedDbModel = MigrationHistoryMapper.MapInsertModelToDbModel(model, dbModel);
            unitOfWork.With<MigrationHistory>().AddOrUpdate(updatedDbModel);
            unitOfWork.SaveChanges();
            var newCustomResult = MigrationHistoryMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}
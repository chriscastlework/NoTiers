using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.MigrationHistoryService
{
    public class Delete : IDeleteEvent<MigrationHistoryViewModel,MigrationHistory >
    {
  
        public bool Run(MigrationHistoryViewModel model, ref IQueryable<MigrationHistory> repository, IUnitOfWork unitOfWork, Response<MigrationHistoryViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<MigrationHistory>().Find(model.Id);
            unitOfWork.With<MigrationHistory>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}

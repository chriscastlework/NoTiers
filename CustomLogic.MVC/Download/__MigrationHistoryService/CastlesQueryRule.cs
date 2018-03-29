using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.MigrationHistoryService
{
    public class LimitMigrationHistorys : IViewListRule<MigrationHistoryViewModel, MigrationHistory>
    {
      
        public bool Run(NgTableParams model, ref IQueryable<MigrationHistory> repository, NgTable<MigrationHistoryViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
             // unitOfWork = unitOfWork.Where(c => c.OwnerId == null);
             // limit by organisation owner etc... business rules 
              return true;
        }

    }
}

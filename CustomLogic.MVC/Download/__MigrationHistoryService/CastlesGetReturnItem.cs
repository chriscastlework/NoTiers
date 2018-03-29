using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.MigrationHistoryService
{
    public class ReturnResultEvent : IUpdateEvent<MigrationHistoryViewModel, MigrationHistory>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(MigrationHistoryViewModel model, ref IQueryable< MigrationHistory> repository, IUnitOfWork unitOfWork, Response<MigrationHistoryViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< MigrationHistory>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = MigrationHistoryMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.MigrationHistoryService
{
    public class View : IViewEvent<MigrationHistoryViewModel,MigrationHistory >
    {
        public int CreatedId = 0;

        public Response<MigrationHistoryViewModel> Run(MigrationHistoryViewModel model,ref IQueryable<MigrationHistory> repository, IUnitOfWork unitOfWork, Response<MigrationHistoryViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = MigrationHistoryMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing MigrationHistory"); 
            }

            return result;
        }

  
    
    }
}
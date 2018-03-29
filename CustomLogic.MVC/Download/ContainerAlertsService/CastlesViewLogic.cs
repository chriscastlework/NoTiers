using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainerAlertsService
{
    public class View : IViewEvent<ContainerAlertsViewModel,ContainerAlert >
    {
        public int CreatedId = 0;

        public Response<ContainerAlertsViewModel> Run(ContainerAlertsViewModel model,ref IQueryable<ContainerAlert> repository, IUnitOfWork unitOfWork, Response<ContainerAlertsViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = ContainerAlertsMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing ContainerAlerts"); 
            }

            return result;
        }

  
    
    }
}
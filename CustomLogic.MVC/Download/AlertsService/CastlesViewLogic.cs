using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AlertsService
{
    public class View : IViewEvent<AlertsViewModel,Alert >
    {
        public int CreatedId = 0;

        public Response<AlertsViewModel> Run(AlertsViewModel model,ref IQueryable<Alert> repository, IUnitOfWork unitOfWork, Response<AlertsViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = AlertsMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing Alerts"); 
            }

            return result;
        }

  
    
    }
}
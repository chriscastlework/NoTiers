using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainersService
{
    public class View : IViewEvent<ContainersViewModel,Container >
    {
        public int CreatedId = 0;

        public Response<ContainersViewModel> Run(ContainersViewModel model,ref IQueryable<Container> repository, IUnitOfWork unitOfWork, Response<ContainersViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = ContainersMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing Containers"); 
            }

            return result;
        }

  
    
    }
}
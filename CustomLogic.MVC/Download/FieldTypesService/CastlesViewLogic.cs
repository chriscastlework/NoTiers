using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.FieldTypesService
{
    public class View : IViewEvent<FieldTypesViewModel,FieldType >
    {
        public int CreatedId = 0;

        public Response<FieldTypesViewModel> Run(FieldTypesViewModel model,ref IQueryable<FieldType> repository, IUnitOfWork unitOfWork, Response<FieldTypesViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = FieldTypesMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing FieldTypes"); 
            }

            return result;
        }

  
    
    }
}
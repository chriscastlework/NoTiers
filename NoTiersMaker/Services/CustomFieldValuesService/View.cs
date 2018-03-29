using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldValuesService
{
    public class View : IViewEvent<CustomFieldValuesViewModel, CustomFieldValue>
    {
        public int CreatedId = 0;

       

    

        public Response<CustomFieldValuesViewModel> Run(CustomFieldValuesViewModel model, ref IQueryable<CustomFieldValue> repository, IUnitOfWork db, Response<CustomFieldValuesViewModel> result,
            ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.EntityId == model.EntityId && c.CustomFieldId == model.CustomFieldId);

            if (itemToUpdate != null)
            {
                var newCustomResult = CustomFieldValuesMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing CustomFieldValues");
            }
            return result;
        }
    }
}
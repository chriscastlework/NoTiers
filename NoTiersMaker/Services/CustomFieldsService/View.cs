using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldsService
{
    public class View : IViewEvent<CustomFieldsViewModel, CustomField>
    {
        public int CreatedId = 0;
        

        public Response<CustomFieldsViewModel> Run(CustomFieldsViewModel model, ref IQueryable<CustomField> repository, IUnitOfWork db, Response<CustomFieldsViewModel> result, ICoreUser user)
        {
            var itemToUpdate = repository.SingleOrDefault(c => c.Id == model.Id);

            if (itemToUpdate != null)
            {
                var newCustomResult = CustomFieldsMapper.MapDbModelToViewModel(itemToUpdate);
                result.Data = newCustomResult;
                result.Success = true;
            }
            else
            {
                result.Success = false;
                result.LogError("Error viewing CustomFields");
            }

            return result;
        }
    }
}
using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.FieldTypesService
{
    public class ReturnResultEvent : IUpdateEvent<FieldTypesViewModel, FieldType>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(FieldTypesViewModel model, ref IQueryable< FieldType> repository, IUnitOfWork unitOfWork, Response<FieldTypesViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< FieldType>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = FieldTypesMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

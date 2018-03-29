using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomObjectService
{
    public class ReturnResultEvent : IUpdateEvent<AomObjectViewModel, AomObject>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(AomObjectViewModel model, ref IQueryable< AomObject> repository, IUnitOfWork unitOfWork, Response<AomObjectViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< AomObject>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = AomObjectMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

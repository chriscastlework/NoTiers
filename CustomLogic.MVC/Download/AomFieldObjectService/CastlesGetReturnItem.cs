using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomFieldObjectService
{
    public class ReturnResultEvent : IUpdateEvent<AomFieldObjectViewModel, AomFieldObject>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(AomFieldObjectViewModel model, ref IQueryable< AomFieldObject> repository, IUnitOfWork unitOfWork, Response<AomFieldObjectViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< AomFieldObject>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = AomFieldObjectMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

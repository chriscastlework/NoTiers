using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainersService
{
    public class ReturnResultEvent : IUpdateEvent<ContainersViewModel, Container>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(ContainersViewModel model, ref IQueryable< Container> repository, IUnitOfWork unitOfWork, Response<ContainersViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< Container>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = ContainersMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

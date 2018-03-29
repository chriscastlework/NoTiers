using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.ContainersService
{
    public class Delete : IDeleteEvent<ContainersViewModel,Container >
    {
  
        public bool Run(ContainersViewModel model, ref IQueryable<Container> repository, IUnitOfWork unitOfWork, Response<ContainersViewModel> result, ICoreUser user)
        {
             // Todo change id for the tables PK
            var customToRemove = unitOfWork.With<Container>().Find(model.Id);
            unitOfWork.With<Container>().Remove(customToRemove);
            unitOfWork.SaveChanges();
            return true;
        }
    }
}

using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.RelationshipObjectService
{
    public class ReturnResultEvent : IUpdateEvent<RelationshipObjectViewModel, RelationshipObject>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(RelationshipObjectViewModel model, ref IQueryable< RelationshipObject> repository, IUnitOfWork unitOfWork, Response<RelationshipObjectViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< RelationshipObject>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = RelationshipObjectMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

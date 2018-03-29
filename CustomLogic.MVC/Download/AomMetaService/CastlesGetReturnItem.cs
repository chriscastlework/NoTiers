using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.AomMetaService
{
    public class ReturnResultEvent : IUpdateEvent<AomMetaViewModel, AomMeta>
    {
        public int priority()
        {
            return 1000;
        }

        public bool Run(AomMetaViewModel model, ref IQueryable< AomMeta> repository, IUnitOfWork unitOfWork, Response<AomMetaViewModel> result, ICoreUser user)
        {
            var updatedDbModel = unitOfWork.With< AomMeta>().Single(c => c.Id == model.Id); // Might be a partial class
            var newCustomResult = AomMetaMapper.MapDbModelToViewModel(updatedDbModel);
            result.Data = newCustomResult;
            return true;
        }
    }
}

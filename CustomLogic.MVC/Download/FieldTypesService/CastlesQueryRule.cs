using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.Database;

namespace CustomLogic.Services.FieldTypesService
{
    public class LimitFieldTypes : IViewListRule<FieldTypesViewModel, FieldType>
    {
      
        public bool Run(NgTableParams model, ref IQueryable<FieldType> repository, NgTable<FieldTypesViewModel> result, ICoreUser user, IUnitOfWork unitOfWork)
        {
             // unitOfWork = unitOfWork.Where(c => c.OwnerId == null);
             // limit by organisation owner etc... business rules 
              return true;
        }

    }
}


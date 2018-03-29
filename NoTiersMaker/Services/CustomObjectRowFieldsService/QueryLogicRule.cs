using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomObjectRowFieldsService
{
    public class QueryLogicRule : IViewListRule<CustomObjectRowFieldsViewModel, CustomObjectRowField>
    {
        public bool Run(NgTableParams model, ref IQueryable<CustomObjectRowField> repository, NgTable<CustomObjectRowFieldsViewModel> result, ICoreUser user, IUnitOfWork db)
        {
          //  repository = repository.Where(c => c.CustomObjectRow.OrganisationId == 396);

            return true;
        }
    }
}
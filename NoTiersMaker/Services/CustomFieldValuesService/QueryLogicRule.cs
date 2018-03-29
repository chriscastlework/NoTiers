using System.Linq;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.CustomFieldValuesService
{
    public class QueryLogicRule : IViewListRule<CustomFieldValuesViewModel, CustomFieldValue>
    {
        public bool Run(NgTableParams model, ref IQueryable<CustomFieldValue> repository, NgTable<CustomFieldValuesViewModel> result, ICoreUser user, IUnitOfWork db)
        {
            repository = repository.Where(c => c.CustomField.OrganisationId == 396);

            return true;
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Models;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.DealsService
{
    public class CheckRequiredFields : IInsertRule<DealsViewModel>
    {
        public bool Run(DealsViewModel model, IUnitOfWork unitOfWork, Response<DealsViewModel> result, ICoreUser user)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                result.LogError("Name Required");
                return false;
            }
            return true;
        }
    }
}

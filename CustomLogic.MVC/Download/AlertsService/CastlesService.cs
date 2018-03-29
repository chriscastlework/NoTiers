using CustomLogic;
using CustomLogic.Core.BaseClasses;
using CustomLogic.Core.Interfaces;
using CustomLogic.Database;

namespace CustomLogic.Services.AlertsService
{
    /// <summary>
    /// This is the wrapper for the IService Please add your custom services here insert/update/get/list are already handled should be enough for rest api  
    /// </summary>
    public class AlertService : ServiceBase<AlertsViewModel, Alert>
    {
        public AlertService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
}


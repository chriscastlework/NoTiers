using CustomLogic;
using CustomLogic.Core.BaseClasses;
using CustomLogic.Core.Interfaces;
using CustomLogic.Database;

namespace CustomLogic.Services.MigrationHistoryService
{
    /// <summary>
    /// This is the wrapper for the IService Please add your custom services here insert/update/get/list are already handled should be enough for rest api  
    /// </summary>
    public class MigrationHistoryService : ServiceBase<MigrationHistoryViewModel, MigrationHistory>
    {
        public MigrationHistoryService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
}


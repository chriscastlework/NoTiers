﻿using CustomLogic.Core.BaseClasses;
using CustomLogic.Core.Interfaces;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.AccountsService
{
    /// <summary>
    /// This is the wrapper for the IService Please add your custom services here insert/update/get/list are already handled should be enough for rest api  
    /// </summary>
    public class AccountService : ServiceBase<AccountsViewModel, Account>
    {
        public AccountService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {

        }
    }
}
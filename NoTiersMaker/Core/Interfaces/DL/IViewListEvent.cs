using System.Linq;
using CustomLogic.Core.Models;

namespace CustomLogic.Core.Interfaces.DL
{
    internal interface IViewListEvent<T, T2> where T2 : class
    {
        bool Run(NgTableParams model, ref IQueryable<T2> repository, NgTable<T> result, ICoreUser user , IUnitOfWork db);
    }
}
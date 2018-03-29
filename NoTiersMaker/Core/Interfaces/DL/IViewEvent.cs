using System.Linq;
using CustomLogic.Core.Models;

namespace CustomLogic.Core.Interfaces.DL
{
    internal interface IViewEvent<T, T2>
    {
        Response<T> Run(T model, ref IQueryable<T2> repository, IUnitOfWork db, Response<T> result, ICoreUser user);
    }
}

using System.Linq;
using CustomLogic.Core.Models;

namespace CustomLogic.Core.Interfaces.BL
{
    public interface IUpdateRule<T, T2>
    {
        bool Run(T model, ref IQueryable<T2> repository, IUnitOfWork unitOfWork, Response<T> result, ICoreUser user);
    }
}


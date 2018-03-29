using CustomLogic.Core.Models;

namespace CustomLogic.Core.Interfaces.BL
{
    public interface IInsertRule<T>
    {
        bool Run(T model, IUnitOfWork unitOfWork, Response<T> result, ICoreUser user);
    }
}


using System.Linq;
using CustomLogic.Core.Models;

namespace CustomLogic.Core.Interfaces.DL
{
    internal interface IUpdateEvent<T, T2>
    {
        /// <summary>
        /// Gets the priority i.e before ips runs the save must have been committed 
        /// </summary>
        /// <returns>1 is done first 100 is done last</returns>
        int priority();
        bool Run(T model, ref IQueryable<T2> repository, IUnitOfWork unitOfWork, Response<T> result, ICoreUser user);
    }
}

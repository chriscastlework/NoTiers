using System.Data.Entity;

namespace  CustomLogic.Core.Interfaces
{
    public interface IUnitOfWork
    {
        IDbSet<T> With<T>() where T : class;
        int SaveChanges();
    }
}


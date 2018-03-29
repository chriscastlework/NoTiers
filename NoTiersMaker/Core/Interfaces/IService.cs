using CustomLogic.Core.Models;

namespace  CustomLogic.Core.Interfaces
{
    /// <summary>
    /// T is view model 
    /// </summary>
    /// <typeparam name="T">View Model</typeparam>
    public interface IService<T>
    {
        Response<T> Insert(T model, ICoreUser user);
        
        Response<T> Update(T model, ICoreUser user);

        Response<T> Delete(T model, ICoreUser user);

        Response<T> View(T model, ICoreUser user);

        NgTable<T> List(NgTableParams ngTableParams, ICoreUser user);
    }
}


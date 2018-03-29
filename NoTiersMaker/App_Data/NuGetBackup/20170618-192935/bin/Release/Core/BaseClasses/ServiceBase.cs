using System;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using CustomLogic.Core.Helpers;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Interfaces.BL;
using CustomLogic.Core.Interfaces.DL;
using CustomLogic.Core.Models;

namespace CustomLogic.Core.BaseClasses
{
    /// <summary>
    /// Generic ServiceBase business logic and data logic and business logic loaded in dynamically changing this core class will cause major refactoring
    /// </summary>
    /// <typeparam name="T">View Model </typeparam>
    /// <typeparam name="T2">Database Model</typeparam>
    public abstract class ServiceBase<T, T2> : IService<T> where T2 : class
    {

        internal readonly IUnitOfWork UnitOfWork;

        internal IQueryable<T2> DbSet;

        protected ServiceBase(IUnitOfWork unitOfWork)
        {
            this.UnitOfWork = unitOfWork;
            this.DbSet = UnitOfWork.With<T2>();
        }

        #region Insert

        public Response<T> Insert(T model, ICoreUser user)
        {
            var result = new Response<T>();

            if (!RunInsertBusinessLogic(new InterfaceLoader<IInsertRule<T>>(), result, model, user))
                return result;

            if (!RunInsertDataLogic(new InterfaceLoader<IInsertEvent<T>>(), result, model))
                return result;

            result.Success = true;
            return result;
        }

        private bool RunInsertDataLogic(InterfaceLoader<IInsertEvent<T>> interfaceLoader, Response<T> result, T model)
        {
            foreach (var interfaceImplementation in interfaceLoader.InterfaceImplementations)
            {
                try
                {
                    if (!interfaceImplementation.Run(model, UnitOfWork, result))
                    {
                        return false;
                    }
                }
                catch (ObjectDisposedException ex)
                {
                   // LogHelper.Error(typeof(IService<T>), "ObjectDisposedException = ", ex);
                    result.LogError("Error with running IInsertEvent ");
                    return false;
                }
                catch (InvalidOperationException ex)
                {
                //    LogHelper.Error(typeof(IService<T>), "ObjectDisposedException = ", ex);
                    result.LogError("Error with running IInsertEvent ");
                    return false;
                }
                catch (DbEntityValidationException ex)
                {
                  //  LogHelper.Error(typeof(IService<T>), "DbEntityValidationException = ", ex);
                    result.LogError("Error with running IInsertEvent ");
                    return false;
                }
                catch (DbUpdateConcurrencyException ex)
                {
                 //   LogHelper.Error(typeof(IService<T>), "DbUpdateConcurrencyException = ", ex);
                    result.LogError("Error with running IInsertEvent ");
                    return false;
                }
                catch (DbUpdateException ex)
                {
                 //   LogHelper.Error(typeof(IService<T>), "DbUpdateException = ", ex);
                    result.LogError("Error with running IInsertEvent ");
                    return false;
                }
                catch (Exception ex)
                {
                 //   LogHelper.Error(typeof(IService<T>), "Exception = ", ex);
                    result.LogError("Error with running IInsertEvent ");
                    return false;
                }
               
            }
            return true;
        }

        private bool RunInsertBusinessLogic(InterfaceLoader<IInsertRule<T>> interfaceLoader, Response<T> result, T model, ICoreUser user)
        {
            foreach (var interfaceImplementation in interfaceLoader.InterfaceImplementations)
            {
                if (!interfaceImplementation.Run(model, UnitOfWork, result, user))
                {
                    return false;
                }
            }
            return true;
        }

        #endregion

        #region Update

        public Response<T> Update(T model, ICoreUser user)
        {
            var result = new Response<T>();
            
            
            if (!RunUpdateBusinessLogic(new InterfaceLoader<IUpdateRule<T>>(), result, model))
            return result;
            
            if (!RunUpdateDataLogic(new InterfaceLoader<IUpdateEvent<T>>(), result, model))
             return result;

            result.Success = true;
            return result;
        }

        private bool RunUpdateDataLogic(InterfaceLoader<IUpdateEvent<T>> interfaceLoader, Response<T> result, T model)
        {
            foreach (var interfaceImplementation in interfaceLoader.InterfaceImplementations)
            {
                if (!interfaceImplementation.Run(model, UnitOfWork, result))
                {
                    return false;
                }
            }
            return true;
        }

        private bool RunUpdateBusinessLogic(InterfaceLoader<IUpdateRule<T>> interfaceLoader, Response<T> result, T model)
        {
            foreach (var interfaceImplementation in interfaceLoader.InterfaceImplementations)
            {
                if (!interfaceImplementation.Run(model, UnitOfWork, result))
                {
                    return false;
                }
            }
            return true;
        }

        #endregion

        #region Delete

        public Response<T> Delete(T model, ICoreUser user)
        {
            var result = new Response<T>();
            
            if (!RunDeleteBusinessLogic(new InterfaceLoader<IDeleteRule<T>>(), result, model))
                return result;
            
            if (!RunDeleteDataLogic(new InterfaceLoader<IDeleteEvent<T>>(), result, model))
                return result;

            result.Success = true;
            return result;
        }

        private bool RunDeleteDataLogic(InterfaceLoader<IDeleteEvent<T>> interfaceLoader, Response<T> result, T model)
        {
            foreach (var interfaceImplementation in interfaceLoader.InterfaceImplementations)
            {
                if (!interfaceImplementation.Run(model, UnitOfWork, result))
                {
                    return false;
                }
            }
            return true;
        }

        private bool RunDeleteBusinessLogic(InterfaceLoader<IDeleteRule<T>> interfaceLoader, Response<T> result, T model)
        {
            foreach (var interfaceImplementation in interfaceLoader.InterfaceImplementations)
            {
                if (!interfaceImplementation.Run(model, UnitOfWork, result))
                {
                    return false;
                }
            }
            return true;
        }

        #endregion
        
        #region View

        public Response<T> View(T model, ICoreUser user)
        {
            var result = new Response<T>();
            
            if (!RunViewBusinessLogic(new InterfaceLoader<IViewRule<T>>(), result, model))
                return result;
            
            if (!RunViewDataLogic(new InterfaceLoader<IViewEvent<T>>(), result, model))
                return result;

            result.Success = true;
            return result;
        }

        private bool RunViewDataLogic(InterfaceLoader<IViewEvent<T>> interfaceLoader, Response<T> result, T model)
        {
            foreach (var interfaceImplementation in interfaceLoader.InterfaceImplementations)
            {
                var viewResult = interfaceImplementation.Run(model, UnitOfWork, result);
                if (!result.Success)
                {
                    return false;
                }
            }
            return true;
        }

        private bool RunViewBusinessLogic(InterfaceLoader<IViewRule<T>> interfaceLoader, Response<T> result, T model)
        {
            foreach (var interfaceImplementation in interfaceLoader.InterfaceImplementations)
            {
                if (!interfaceImplementation.Run(model, UnitOfWork, result))
                {
                    return false;
                }
            }
            return true;
        }

        #endregion
        
        #region View List
        public NgTable<T> List(NgTableParams ngTableParams, ICoreUser user)
        {
            var result = new NgTable<T>();

            if (!RunViewListBusinessLogic(new InterfaceLoader<IViewListRule<T,T2>>(), result, ngTableParams, user))
                return result;

            if (!RunViewListDataLogic(new InterfaceLoader<IViewListEvent<T,T2>>(), result, ngTableParams, user))
                return result;

            result.Success = true;
            return result;
        }

        private bool RunViewListDataLogic(InterfaceLoader<IViewListEvent<T, T2>> interfaceLoader, NgTable<T> result, NgTableParams ngTableParams, ICoreUser user)
        {
            foreach (var interfaceImplementation in interfaceLoader.InterfaceImplementations)
            {
                if (!interfaceImplementation.Run(ngTableParams, ref DbSet, result, user, UnitOfWork))
                {
                    return false;
                }
            }
            return true;
        }

        private bool RunViewListBusinessLogic(InterfaceLoader<IViewListRule<T, T2>> interfaceLoader, NgTable<T> result, NgTableParams ngTableParams, ICoreUser user)
        {
            foreach (var interfaceImplementation in interfaceLoader.InterfaceImplementations)
            {
                if (!interfaceImplementation.Run(ngTableParams, ref DbSet, result, user, UnitOfWork))
                {
                    return false;
                }
            }
            return true;
        }

        #endregion

    }
}

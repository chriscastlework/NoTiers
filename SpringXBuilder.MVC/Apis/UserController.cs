using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using CustomLogic.Core.Database;
using CustomLogic.Core.Interfaces;
using CustomLogic.Core.Models;
using CustomLogic.Services.UsersService;

namespace SpringXBuilder.MVC.Apis
{
    public class UserController : ApiController
    {
        private readonly IService<UsersViewModel> UserService = new UserService(new VelocityRocketLegacy());


        // GET: api/User
        public NgTable<UsersViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<UsersViewModel> result = UserService.List(queryTableParams, null);
            return result;
        }

        // GET: api/User/5
        public Response<UsersViewModel> Get(string id)
        {
            Response<UsersViewModel> result = UserService.View(new UsersViewModel { UserId = id }, null);

            return result;
        }

        // POST: api/User
        public NgTable<UsersViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<UsersViewModel> result = UserService.List(queryTableParams, null);

            return result;
        }

        // PUT: api/User/5
        public Response<UsersViewModel> Put(int id, UsersViewModel model)
        {
            Response<UsersViewModel> result = UserService.Insert(model, null);

            return result;
        }

        // DELETE: api/User/5
        public Response<UsersViewModel> Delete(string id)
        {
            Response<UsersViewModel> result = UserService.Delete(new UsersViewModel { UserId = id }, null);

            return result;
        }
    }
}
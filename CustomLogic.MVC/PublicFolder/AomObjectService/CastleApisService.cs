

   public class AomObjectController : ApiController
    {
        private readonly IService<AomObjectViewModel> AomObjectService = new AomObjectService(new VelocityRocketLegacy());


        // GET: api/AomObject
        public NgTable<AomObjectViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<AomObjectViewModel> result = AomObjectService.List(queryTableParams, null);
            return result;
        }

        // GET: api/AomObject/5
        public Response<AomObjectViewModel> Get(int id)
        {
            Response<AomObjectViewModel> result = AomObjectService.View(new AomObjectViewModel {Id = id}, null);

            return result;
        }

        // POST: api/AomObject
        public NgTable<AomObjectViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<AomObjectViewModel> result = AomObjectService.List(queryTableParams, null);

            return result;
        }

        // PUT: api/AomObject/5
        public Response<AomObjectViewModel> Put(int id, AomObjectViewModel model)
        {
            Response<AomObjectViewModel> result = AomObjectService.Insert(model, null);

            return result;
        }

        // DELETE: api/AomObject/5
        public Response<AomObjectViewModel> Delete(int id)
        {
            Response<AomObjectViewModel> result = AomObjectService.Delete(new AomObjectViewModel { Id = id }, null);

            return result;
        }
    }

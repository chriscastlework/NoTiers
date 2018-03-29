

   public class AomFieldObjectController : ApiController
    {
        private readonly IService<AomFieldObjectViewModel> AomFieldObjectService = new AomFieldObjectService(new VelocityRocketLegacy());


        // GET: api/AomFieldObject
        public NgTable<AomFieldObjectViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<AomFieldObjectViewModel> result = AomFieldObjectService.List(queryTableParams, null);
            return result;
        }

        // GET: api/AomFieldObject/5
        public Response<AomFieldObjectViewModel> Get(int id)
        {
            Response<AomFieldObjectViewModel> result = AomFieldObjectService.View(new AomFieldObjectViewModel {Id = id}, null);

            return result;
        }

        // POST: api/AomFieldObject
        public NgTable<AomFieldObjectViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<AomFieldObjectViewModel> result = AomFieldObjectService.List(queryTableParams, null);

            return result;
        }

        // PUT: api/AomFieldObject/5
        public Response<AomFieldObjectViewModel> Put(int id, AomFieldObjectViewModel model)
        {
            Response<AomFieldObjectViewModel> result = AomFieldObjectService.Insert(model, null);

            return result;
        }

        // DELETE: api/AomFieldObject/5
        public Response<AomFieldObjectViewModel> Delete(int id)
        {
            Response<AomFieldObjectViewModel> result = AomFieldObjectService.Delete(new AomFieldObjectViewModel { Id = id }, null);

            return result;
        }
    }

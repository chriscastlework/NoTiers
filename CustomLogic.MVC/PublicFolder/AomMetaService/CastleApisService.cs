

   public class AomMetaController : ApiController
    {
        private readonly IService<AomMetaViewModel> AomMetaService = new AomMetaService(new VelocityRocketLegacy());


        // GET: api/AomMeta
        public NgTable<AomMetaViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<AomMetaViewModel> result = AomMetaService.List(queryTableParams, null);
            return result;
        }

        // GET: api/AomMeta/5
        public Response<AomMetaViewModel> Get(int id)
        {
            Response<AomMetaViewModel> result = AomMetaService.View(new AomMetaViewModel {Id = id}, null);

            return result;
        }

        // POST: api/AomMeta
        public NgTable<AomMetaViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<AomMetaViewModel> result = AomMetaService.List(queryTableParams, null);

            return result;
        }

        // PUT: api/AomMeta/5
        public Response<AomMetaViewModel> Put(int id, AomMetaViewModel model)
        {
            Response<AomMetaViewModel> result = AomMetaService.Insert(model, null);

            return result;
        }

        // DELETE: api/AomMeta/5
        public Response<AomMetaViewModel> Delete(int id)
        {
            Response<AomMetaViewModel> result = AomMetaService.Delete(new AomMetaViewModel { Id = id }, null);

            return result;
        }
    }

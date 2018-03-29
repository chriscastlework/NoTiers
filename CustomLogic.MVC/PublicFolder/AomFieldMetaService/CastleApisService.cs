

   public class AomFieldMetaController : ApiController
    {
        private readonly IService<AomFieldMetaViewModel> AomFieldMetaService = new AomFieldMetaService(new VelocityRocketLegacy());


        // GET: api/AomFieldMeta
        public NgTable<AomFieldMetaViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<AomFieldMetaViewModel> result = AomFieldMetaService.List(queryTableParams, null);
            return result;
        }

        // GET: api/AomFieldMeta/5
        public Response<AomFieldMetaViewModel> Get(int id)
        {
            Response<AomFieldMetaViewModel> result = AomFieldMetaService.View(new AomFieldMetaViewModel {Id = id}, null);

            return result;
        }

        // POST: api/AomFieldMeta
        public NgTable<AomFieldMetaViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<AomFieldMetaViewModel> result = AomFieldMetaService.List(queryTableParams, null);

            return result;
        }

        // PUT: api/AomFieldMeta/5
        public Response<AomFieldMetaViewModel> Put(int id, AomFieldMetaViewModel model)
        {
            Response<AomFieldMetaViewModel> result = AomFieldMetaService.Insert(model, null);

            return result;
        }

        // DELETE: api/AomFieldMeta/5
        public Response<AomFieldMetaViewModel> Delete(int id)
        {
            Response<AomFieldMetaViewModel> result = AomFieldMetaService.Delete(new AomFieldMetaViewModel { Id = id }, null);

            return result;
        }
    }

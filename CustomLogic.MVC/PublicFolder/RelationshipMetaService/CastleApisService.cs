

   public class RelationshipMetaController : ApiController
    {
        private readonly IService<RelationshipMetaViewModel> RelationshipMetaService = new RelationshipMetaService(new VelocityRocketLegacy());


        // GET: api/RelationshipMeta
        public NgTable<RelationshipMetaViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<RelationshipMetaViewModel> result = RelationshipMetaService.List(queryTableParams, null);
            return result;
        }

        // GET: api/RelationshipMeta/5
        public Response<RelationshipMetaViewModel> Get(int id)
        {
            Response<RelationshipMetaViewModel> result = RelationshipMetaService.View(new RelationshipMetaViewModel {Id = id}, null);

            return result;
        }

        // POST: api/RelationshipMeta
        public NgTable<RelationshipMetaViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<RelationshipMetaViewModel> result = RelationshipMetaService.List(queryTableParams, null);

            return result;
        }

        // PUT: api/RelationshipMeta/5
        public Response<RelationshipMetaViewModel> Put(int id, RelationshipMetaViewModel model)
        {
            Response<RelationshipMetaViewModel> result = RelationshipMetaService.Insert(model, null);

            return result;
        }

        // DELETE: api/RelationshipMeta/5
        public Response<RelationshipMetaViewModel> Delete(int id)
        {
            Response<RelationshipMetaViewModel> result = RelationshipMetaService.Delete(new RelationshipMetaViewModel { Id = id }, null);

            return result;
        }
    }

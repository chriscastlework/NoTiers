

   public class RelationshipObjectController : ApiController
    {
        private readonly IService<RelationshipObjectViewModel> RelationshipObjectService = new RelationshipObjectService(new VelocityRocketLegacy());


        // GET: api/RelationshipObject
        public NgTable<RelationshipObjectViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<RelationshipObjectViewModel> result = RelationshipObjectService.List(queryTableParams, null);
            return result;
        }

        // GET: api/RelationshipObject/5
        public Response<RelationshipObjectViewModel> Get(int id)
        {
            Response<RelationshipObjectViewModel> result = RelationshipObjectService.View(new RelationshipObjectViewModel {Id = id}, null);

            return result;
        }

        // POST: api/RelationshipObject
        public NgTable<RelationshipObjectViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<RelationshipObjectViewModel> result = RelationshipObjectService.List(queryTableParams, null);

            return result;
        }

        // PUT: api/RelationshipObject/5
        public Response<RelationshipObjectViewModel> Put(int id, RelationshipObjectViewModel model)
        {
            Response<RelationshipObjectViewModel> result = RelationshipObjectService.Insert(model, null);

            return result;
        }

        // DELETE: api/RelationshipObject/5
        public Response<RelationshipObjectViewModel> Delete(int id)
        {
            Response<RelationshipObjectViewModel> result = RelationshipObjectService.Delete(new RelationshipObjectViewModel { Id = id }, null);

            return result;
        }
    }



   public class RelationshipTypeController : ApiController
    {
        private readonly IService<RelationshipTypesViewModel> RelationshipTypeService = new RelationshipTypeService(new VelocityRocketLegacy());


        // GET: api/RelationshipType
        public NgTable<RelationshipTypesViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<RelationshipTypesViewModel> result = RelationshipTypeService.List(queryTableParams, null);
            return result;
        }

        // GET: api/RelationshipType/5
        public Response<RelationshipTypesViewModel> Get(int id)
        {
            Response<RelationshipTypesViewModel> result = RelationshipTypeService.View(new RelationshipTypesViewModel {Id = id}, null);

            return result;
        }

        // POST: api/RelationshipType
        public NgTable<RelationshipTypesViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<RelationshipTypesViewModel> result = RelationshipTypeService.List(queryTableParams, null);

            return result;
        }

        // PUT: api/RelationshipType/5
        public Response<RelationshipTypesViewModel> Put(int id, RelationshipTypesViewModel model)
        {
            Response<RelationshipTypesViewModel> result = RelationshipTypeService.Insert(model, null);

            return result;
        }

        // DELETE: api/RelationshipType/5
        public Response<RelationshipTypesViewModel> Delete(int id)
        {
            Response<RelationshipTypesViewModel> result = RelationshipTypeService.Delete(new RelationshipTypesViewModel { Id = id }, null);

            return result;
        }
    }

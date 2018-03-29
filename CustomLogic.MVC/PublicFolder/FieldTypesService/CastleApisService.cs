

   public class FieldTypeController : ApiController
    {
        private readonly IService<FieldTypesViewModel> FieldTypeService = new FieldTypeService(new VelocityRocketLegacy());


        // GET: api/FieldType
        public NgTable<FieldTypesViewModel> Get()
        {
            var queryTableParams = new NgTableParams();
            NgTable<FieldTypesViewModel> result = FieldTypeService.List(queryTableParams, null);
            return result;
        }

        // GET: api/FieldType/5
        public Response<FieldTypesViewModel> Get(int id)
        {
            Response<FieldTypesViewModel> result = FieldTypeService.View(new FieldTypesViewModel {Id = id}, null);

            return result;
        }

        // POST: api/FieldType
        public NgTable<FieldTypesViewModel> Post(NgTableParams queryTableParams)
        {
            NgTable<FieldTypesViewModel> result = FieldTypeService.List(queryTableParams, null);

            return result;
        }

        // PUT: api/FieldType/5
        public Response<FieldTypesViewModel> Put(int id, FieldTypesViewModel model)
        {
            Response<FieldTypesViewModel> result = FieldTypeService.Insert(model, null);

            return result;
        }

        // DELETE: api/FieldType/5
        public Response<FieldTypesViewModel> Delete(int id)
        {
            Response<FieldTypesViewModel> result = FieldTypeService.Delete(new FieldTypesViewModel { Id = id }, null);

            return result;
        }
    }

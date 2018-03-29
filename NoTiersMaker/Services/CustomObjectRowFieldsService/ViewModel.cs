namespace CustomLogic.Services.CustomObjectRowFieldsService
{

    public class CustomObjectRowFieldsViewModel
    {

        public long Id { get; set; }
        public string Value { get; set; }
        public int? Field_Id { get; set; }
        public long? CustomObjectRow_Id { get; set; }

        public string CustomObjectType { get; set; }

        public string CustomRowName { get; set; }

    }

}

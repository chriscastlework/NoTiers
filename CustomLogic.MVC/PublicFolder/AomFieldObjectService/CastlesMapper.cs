 public static class AomFieldObjectMapper
    {


        public static AomFieldObject MapInsertModelToDbModel(AomFieldObjectViewModel model, AomFieldObject newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new AomFieldObject();
            }

newDomainModel.ID = model.ID;
newDomainModel.AOMObjectID = model.AOMObjectID;
newDomainModel.AOMFieldMetaID = model.AOMFieldMetaID;
newDomainModel.Value = model.Value;

            return newDomainModel;
        }



        public static AomFieldObjectViewModel MapDbModelToViewModel(AomFieldObject dbModel)
        {
            var viewModel = new  AomFieldObjectViewModel();
viewModel.ID = dbModel.ID;
viewModel.AOMObjectID = dbModel.AOMObjectID;
viewModel.AOMFieldMetaID = dbModel.AOMFieldMetaID;
viewModel.Value = dbModel.Value;
            return viewModel;
        }

        public static IQueryable<AomFieldObjectViewModel> MapDbModelQueryToViewModelQuery(IQueryable<AomFieldObject> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new AomFieldObjectViewModel()
                                             {
                                                 ID = c.ID,
AOMObjectID = c.AOMObjectID,
AOMFieldMetaID = c.AOMFieldMetaID,
Value = c.Value,
                                             });
        }




}


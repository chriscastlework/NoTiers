 public static class AomFieldMetaMapper
    {


        public static AomFieldMeta MapInsertModelToDbModel(AomFieldMetaViewModel model, AomFieldMeta newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new AomFieldMeta();
            }

newDomainModel.ID = model.ID;
newDomainModel.AOMMetaID = model.AOMMetaID;
newDomainModel.Name = model.Name;
newDomainModel.FieldTypeID = model.FieldTypeID;

            return newDomainModel;
        }



        public static AomFieldMetaViewModel MapDbModelToViewModel(AomFieldMeta dbModel)
        {
            var viewModel = new  AomFieldMetaViewModel();
viewModel.ID = dbModel.ID;
viewModel.AOMMetaID = dbModel.AOMMetaID;
viewModel.Name = dbModel.Name;
viewModel.FieldTypeID = dbModel.FieldTypeID;
            return viewModel;
        }

        public static IQueryable<AomFieldMetaViewModel> MapDbModelQueryToViewModelQuery(IQueryable<AomFieldMeta> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new AomFieldMetaViewModel()
                                             {
                                                 ID = c.ID,
AOMMetaID = c.AOMMetaID,
Name = c.Name,
FieldTypeID = c.FieldTypeID,
                                             });
        }




}

